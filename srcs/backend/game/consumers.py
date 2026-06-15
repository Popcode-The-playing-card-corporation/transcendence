import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from .models import PlayerPresence, Room, PlayerScore, Stat, GameLog
from api.models import Friendship, User
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from game_engine.bot.bot import bot
from django.db.models import Q
import copy
from .services.game_service import GameService
from .services.room_service import RoomService
from .services.meld_service import MeldService
from .services.bot_service import BotService
from .services.room_connection_service import RoomConnectionService

from channels.exceptions import ChannelFull

CARD_VALUES = {
    "6": 6,
    "7": 7,
    "8": 8,
    "9": 9,
    "10": 10,
    "J": 11,
    "Q": 12,
    "K": 13,
    "A": 14
}
#TODO bug on open room to reconnect if server down
ACTION_HANDLERS = {
    "start_game": "handle_start_game",
    "play_card": "handle_play_card",
    "continue": "handle_continue_game",
    "end_game": "handle_end_game",
    "melds": "handle_melds",
    "verify_melds": "handle_verify_melds",
    "kick": "handle_kick",
}
#TODO vote in game to ban a player (majorité qui remporte le vote ? tout le monde sauf la cible peut voté)
class RoomConsumer(AsyncWebsocketConsumer):
    
    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))
    
    async def private_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "list_player",
            "event": event["event"],
            "payload": event["payload"]
        }))

    async def list_player_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "list_player",
            "event": event["event"],
            "payload": event["payload"]
        }))
    
    async def params_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "params",
            "event": event["event"],
            "payload": event["payload"]
        }))

    async def room_event(self, event):
        if event["event"] == "force_disconnect":
            await self.close(code=4001)  # close WebSocket
            return
       
        await self.send(text_data=json.dumps({
            "type": "event",
            "event": event["event"],
            "payload": event.get("payload", {}),
        }))

    async def error(self, message: str):
        await self.send(text_data=json.dumps({
            "type": "error",
            "message": message
        }))
    
    #TODO avoid does not exist error on room connection
    
    async def connect(self):
        self.code = self.scope["url_route"]["kwargs"]["code"]
        self.group_name = f"room_{self.code}"
        self.user = self.scope.get("user")
    
        result = await RoomConnectionService.handle_connect(
            user=self.user,
            code=self.code,
            channel_name=self.channel_name
        )
    
        if result.get("close"):
            await self.accept()
            if result["code"] == 42:
                await self.send_json({"message": "you have already a game websocket open"})
                await self.close(code=4003)
                return
                
            await self.send_json(result.get("message", {}))
            await self.close(code=result["code"])
            return
    
        await self.accept()
        await self.channel_layer.group_add(self.group_name, self.channel_name)
    
        await RoomConnectionService.finalize_join(
            user=self.user,
            code=self.code,
            channel_name=self.channel_name
        )
        room = await get_room_with_host(self.code)
        await RoomConnectionService.broadcast_player_list(
            room,
            self.channel_layer
        )
        
        await RoomConnectionService.broadcast_room_params(
            room,
            self.channel_layer
        )
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "user_joined",
                "payload": {"user": self.get_username()},
            }
        )
        
        room = await sync_to_async(Room.objects.get)(code=self.code)
        
        if room.status == "start":
            await self.send_data()
    
    async def disconnect(self, close_code):
    
        if not self.user.is_authenticated:
            return
    
        if self.group_name:
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )
    
        result = await RoomService.handle_player_disconnect(
            self.user,
            self.code
        )
        
        if result == None:
            return
        room = result["room"]
    
        await RoomConnectionService.broadcast_player_list(
            room,
            self.channel_layer
        )
    
        if self.group_name:
    
            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "room_event",
                    "event": "user_left",
                    "payload": {
                        "user": self.get_username(),
                    }
                }
            )
    
            if result["host_changed"]:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "room_event",
                        "event": "host_changed",
                        "payload": {
                            "new_host": room.host.username
                        }
                    }
                )
    
        try:
            await BotService.replace_disconnected_player(
                room,
                self.user,
                self.handle_play_card
            )
        except Exception:
            pass

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            if data.get("type") == "heartbeat":
                await self.send(text_data=json.dumps({
					"type": "acknowledge"
				}))
                return
                
            if data.get("type") != "action":
                return await self.error("Unknown message type")
        
            action = data.get("action")
            payload = data.get("payload", {})
            
            handler_name = ACTION_HANDLERS.get(action)
        
            if not handler_name:
                return await self.error("Unknown action")
        
            handler = getattr(self, handler_name)
            await handler(payload)
            
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "Invalid JSON"
            }))

    async def handle_start_game(self, payload=None):
        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            return await self.error("Only host")
    
        if room.nb_player < 2:
            return await self.error("Need 2 players")
    
        if room.status == "start":
            return await self.error("Already started")
        
        players = await sync_to_async(list)(
            PlayerPresence.objects.filter(room=room).select_related("player")
        )
        
        for player in players:
        
            await self.channel_layer.group_send(
                f"user_{player.player.id}",
                {
                    "type": "notify",
                    "type_notify": "game_started",
                    "event": "notification",
                    "payload": {
                        "from_user": self.user.username,
                        "from_user_id": self.user.id,
                        "message": f"{self.user.username} start the game"
                    }
                }
            )
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_started",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )

        game_state = await GameService.start_game(room, send_data_callback=self.send_data, send_init_callback=self.send_init)

    async def handle_play_card(self, payload):
        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)

        result = await GameService.play_card(
            room=room,
            user=self.user,
            position=position,
            card_id=payload["cardId"]
        )

        if result.get("error"):
            await self.error(result["error"])
            return

        await self.send_data()

        room = await get_room_with_host(self.code)
        game_state = room.game_state

        take_fold, game_state = await GameService.check_take_fold(game_state, room)

        if (take_fold):
            await self.send_data()

        game = GameEngine(room.uuid)
        game_state = await BotService.play_until_human(room, game_state, game, 
                                                       send_data_callback=self.send_data, 
                                                       check_end=GameService.check_game_end, 
                                                       check_take_fold_callback=GameService.check_take_fold
                                                       )

        is_end, gs = await GameService.check_game_end(room, game)
        
        if (is_end):
            await GameService.ask_host_continue(room, gs)
        
    async def handle_melds(self, payload):
        room = await get_room_with_host(self.code)
    
        result = await MeldService.play_meld(
            room=room,
            user=self.user,
            cards=payload["cards"]
        )
    
        if result.get("error"):
            return await self.error(result["error"])
    
        await self.send_data()

    async def handle_verify_melds(self, payload):
        room = await get_room_with_host(self.code)
    
        result = await MeldService.verify_melds(
            room=room,
            user=self.user,
            cards=payload["cards"]
        )
    
        await self.send(json.dumps(result))

    async def handle_kick(self, payload: dict):
        room = await get_room_with_host(self.code)
    
        result = await RoomService.kick_player(
            room=room,
            host=self.user,
            player_position=payload["playerId"]
        )
    
        if result["error"]:
            return await self.error(result["error"])
    
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "kick_player",
                "payload": result["payload"]
            }
        )
    
        room = await get_room_with_host(self.code)
        await RoomConnectionService.broadcast_player_list(room, self.channel_layer)
        
        if result["kicked_channel"]:
            await self.channel_layer.send(
                result["kicked_channel"],
                {
                    "type": "room_event",
                    "event": "kicked",
                    "payload": {
                        "message": "You have been kicked from the room",
                        "by": self.user.username
                    }
                }
            )
    
            await self.channel_layer.send(
                result["kicked_channel"],
                {
                    "type": "force_disconnect",
                }
            )

    async def handle_continue_game(self, payload=None):

        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            return await self.error("Only host can restart game")
    
        if room.status != "start":
            return await self.error("Only a finished game can restart game")
        
        game = GameEngine(room.uuid)
        is_end, gs = await GameService.check_game_end(room, game)
        if not is_end:
            return await self.error("Game not finished")
            
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_started",
                "payload": {
                    "user": self.get_username(),
                }
            }
        )
    
        game_state = await GameService.continue_game(
            room,
            send_data_callback=self.send_data,
            send_init_callback=self.send_init
        )

    async def handle_end_game(self, payload=None):
        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            return await self.error("Only host")
    
        if room.status != "start":
            return await self.error("Only a finished game can restart game")
        
        game = GameEngine(room.uuid)
        is_end, gs = await GameService.check_game_end(room, game)
        if not is_end:
            return await self.error("Game not finished")
    
        room.status = "end"
        await sync_to_async(room.save)()
    
        await end_room(room.uuid, room.game_state)
    
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_ended",
                "payload": {}
            }
        )
        await self.channel_layer.group_send(
        self.group_name,
        {
            "type": "room_event",
            "event": "force_disconnect",
            "payload": {
                "message": "Room closed by host"
            }
        }
)

    async def send_init(self):
        room = await get_room_with_host(self.code)
        game_state = room.game_state
        
        game = GameEngine(room.uuid)
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
                room=room,
                position=int(player_id)
            )
            if int(player_id) == game_state["playing"]:
                legal = game.handleAction("legal", game_state, idPlayer=str(player_id))
                if p.channel_name:
                    await self.channel_layer.send(
                        p.channel_name,
                        {
                            "type": "private_event",
                            "event": "init_cards",
                            "payload": {
                                "hand": player_data["cards"],
                                "legal": legal,
                                "melds": await GameService.count_melds(player_data["cards"])
                            }
                        }
                    )

        
                    await self.channel_layer.group_send(
                        f"user_{p.player.id}",
                        {
                            "type": "notify",
                            "event": "notification",
                            "type_notify": "your_turn",
                    
                            "payload": {
                                "message": f"It's your time to play"
                            }
                        }
                    )
            else:
                if p.channel_name:
                    await self.channel_layer.send(
                        p.channel_name,
                        {
                            "type": "private_event",
                            "event": "init_cards",
                            "payload": {
                                "hand": player_data["cards"],
                                "melds": await GameService.count_melds(player_data["cards"])
                            }
                        }
                    )
        await self.send_board(game_state, room)

#TODO send all melds possible
    async def send_data(self):
        room = await get_room_with_host(self.code)
        game_state = room.game_state

        game = GameEngine(room.uuid)
        
        p = await sync_to_async(
            PlayerPresence.objects.select_related("player").get
        )(
            room=room,
            position=int(game_state["playing"])
        )
        try:
            if p.position == game_state["playing"]:
                legal = game.handleAction("legal", game_state, idPlayer=str(p.position))
                if p.channel_name:
                    player_data = game_state["players"][str(p.position)]
                    await self.channel_layer.send(
                        p.channel_name,
                        {
                            "type": "private_event",
                            "event": "init_cards",
                            "payload": {
                                "hand": player_data["cards"],
                                "legal": legal,
                            }
                        }
                    )

                    await self.channel_layer.group_send(
                        f"user_{p.player.id}",
                        {
                            "type": "notify",
                            "event": "notification",
                            "type_notify": "your_turn",
                    
                            "payload": {
                                "message": f"It's your time to play"
                            }
                        }
                    )
            
            await self.send_board(game_state, room)
            
        except ChannelFull:
            print("Channel is full. Dropping message.")
    
     
    async def send_board(self, game_state, room):
        player_puntos = {}
        player_list = {}
        for player_id, player_data in game_state["players"].items():
            
            p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
				room_id=room.id,
                position=int(player_id)
			)
            
            player_puntos[str(player_id)] = player_data["puntos"]
            player_list[str(player_id)] = {
                "hand": len(player_data["cards"]),
                "user": {"id": p.player.id, "username": p.player.username, "avatar": p.player.avatar}
            }
            
        
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
			room_id=room.id,
            player=self.user
        )
        
        logs = await sync_to_async(list)(
            GameLog.objects.filter(room=room)
        )
        detailed_points = {}

        nb_round = int(36 / room.nb_player)
        for log in logs:
            player = await sync_to_async(
                PlayerPresence.objects.select_related("player").get
            )(
                room_id=log.room_id,
                player_id=log.player_id
            )
        
            if log.game not in detailed_points:
                detailed_points[log.game] = {}
            
            if log.round == nb_round:
                if "total" not in detailed_points[log.game]:
                    detailed_points[log.game]["total"] = []
            
                detailed_points[log.game]["is_finished"] = True
            
                detailed_points[log.game]["total"].append({
                    "id": player.player_id,
                    "username": player.player.username,
                    "score": log.score,
                })
            else:
                if log.round not in detailed_points[log.game]:
                    detailed_points[log.game][log.round] = []
            
                detailed_points[log.game][log.round].append({
                    "id": player.player_id,
                    "username": player.player.username,
                    "score": log.score,
                })
                
        tmp_board = game_state['board']
        asked = tmp_board.get('asked')
        if asked:
            board = []
            for id, cards in tmp_board.items():
                if id == "asked":
                    continue
                board.append({"room_id":id, "card":cards})
        else:
            board = []
            
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "board_data",
                "payload": {
                    "self_id": p.position,
                    "board": board,
                    "asked": asked,
                    "points": player_puntos,
                    "detailed_points": detailed_points,
                    "playing": game_state["playing"],
                    "player_list": player_list,
                    "started_at": room.started_at.strftime("%Y-%m-%d %H:%M:%S"),
                    "round_time": game_state["round_time"],
                    "round": game_state["round"],
                    "last_fold": game_state.get("last_fold")
                }
            }
        )
    
    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"