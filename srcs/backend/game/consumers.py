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
from django.utils import timezone
from .services.game_service import GameService
from .services.room_service import RoomService
from .services.meld_service import MeldService
from .services.bot_service import BotService
from .services.room_connection_service import RoomConnectionService
from .services.broadcast_service import BroadcastService

import asyncio
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
    "kick": "handle_kick",
}
#TODO vote in game to ban a player (majorité qui remporte le vote ? tout le monde sauf la cible peut voté)
class RoomConsumer(AsyncWebsocketConsumer):
    
    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

    async def game_event(self, event):
        if event["event"] == "force_disconnect":
            await self.close(code=4001)  # close WebSocket
            return
        
        await self.send(text_data=json.dumps({
            "type": "game",
            "event": event["event"],
            "payload": event["payload"]
        }))


    async def settings_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "settings",
            "event": event["event"],
            "payload": event["payload"]
        }))

    async def error(self, message: str):
        await self.send(text_data=json.dumps({
            "type": "error",
            "message": message
        }))
    
    async def room_closed(self, event):
        await self.send_json({
            "event": "room_closed",
            "reason": event["reason"]
        })
    
        await self.close()
        
    async def player_afk(self, event):
        room = await get_room_with_host(event["code"])
        game = GameEngine(room.uuid)
    
        game_state = await BotService.play_until_human(room, room.game_state, game,
                                                        check_end=GameService.check_game_end, 
                                                        check_take_fold_callback=GameService.check_take_fold
                                                        )
        finished, game_state = await GameService.check_game_end(room, game)

        if finished and room.status == "start":
            await GameService.ask_host_continue(room, room.game_state)
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
        
        await self.channel_layer.group_add(f"player_{self.user.id}", self.channel_name)
    
        await RoomConnectionService.finalize_join(
            user=self.user,
            code=self.code,
            channel_name=self.channel_name
        )
        room = await get_room_with_host(self.code)
        if room.status == "open":
            if self.user.id == room.host_id:
                await BroadcastService.broadcast_settings(
                    self.code,
                    self.channel_layer,
                    "host_join",
                    f"player_{room.host_id}",
                )
            else:
                await BroadcastService.broadcast_settings(
                    self.code,
                    self.channel_layer,
                    "player_join",
                    f"room_{room.code}",
                )
        
        room = await get_room_with_host(self.code)
        game = GameEngine(room.uuid)
        finished, game_state = await GameService.check_game_end(room, game)

        if finished and room.status == "start":
            await GameService.ask_host_continue(room, room.game_state)
            
        if room.status == "start":
            await BroadcastService.broadcast_game(self.code, self.channel_layer, "player_reconnect", self.user.username)
    
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

        if room.status == "open":
            await BroadcastService.broadcast_settings(
                room.code,
                self.channel_layer,
                "player_left",
                f"room_{room.code}",
            )
        if room.status == "start":
            await BroadcastService.broadcast_game(self.code, self.channel_layer, "player_disconnect", self.user.username)
    
        try:
            room = await get_room_with_host(room.code)
            game = GameEngine(room.uuid)
        
            game_state = await BotService.play_until_human(room, room.game_state, game,
                                                            check_end=GameService.check_game_end, 
                                                            check_take_fold_callback=GameService.check_take_fold
                                                            )
        except Exception:
            pass

    async def receive(self, text_data):
        asyncio.create_task(self.stream_message(text_data))

    async def stream_message(self, text_data):
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

        game_state = await GameService.start_game(room)

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
        
        if result.get("invalid"):
            return

        await BroadcastService.broadcast_game(self.code, self.channel_layer, "card_valid")

        room = await get_room_with_host(self.code)
        game_state = room.game_state

        take_fold, game_state = await GameService.check_take_fold(game_state, room)

        if (take_fold):
            await BroadcastService.broadcast_game(self.code, self.channel_layer, "finish_round")

        game = GameEngine(room.uuid)
        game_state = await BotService.play_until_human(room, game_state, game,
                                                       check_end=GameService.check_game_end, 
                                                       check_take_fold_callback=GameService.check_take_fold
                                                       )

        is_end, gs = await GameService.check_game_end(room, game)
        
        if (is_end):
            await GameService.ask_host_continue(room, gs)
        
    async def handle_send_melds(self, payload):
        room = await get_room_with_host(self.code)
    
        result = await MeldService.play_meld(
            room=room,
            user=self.user,
            cards=payload["cards"]
        )
    
        if result.get("error"):
            return await self.error(result["error"])
    
        #await BroadcastService.broadcast_game(self.code, self.channel_layer, "annonces_valid")

    async def handle_melds(self, payload):
        room = await get_room_with_host(self.code)
    
        result = await MeldService.verify_melds(
            room=room,
            user=self.user,
            cards=payload["cards"]
        )
    
        await self.send(json.dumps(result))

    async def handle_kick(self, payload: dict):
        if "playerId" not in payload:
            await self.send_json({
                "error": "missing_playerId"
            })
            return
        room = await get_room_with_host(self.code)
    
        result = await RoomService.kick_player(
            room=room,
            host=self.user,
            player_position=payload["playerId"]
        )
    
        if result["error"]:
            return await self.error(result["error"])
    
        await self.channel_layer.group_send(
            f"player_{room.host_id}",
            {
                "type": "settings_event",
                "event": "player_kicked",
                "payload": {
                        "message": "Kick success"
                    }
            }
        )
    

        await BroadcastService.broadcast_settings(
            self.code,
            self.channel_layer,
            "player_kicked",
            f"room_{room.code}",
        )
        
        if result["kicked_channel"]:
            await self.channel_layer.send(
                result["kicked_channel"],
                {
                    "type": "settings_event",
                    "event": "player_kicked",
                    "payload": {
                        "message": "You have been kicked from the room"
                    }
                }
            )
    
            await self.channel_layer.send(
                result["kicked_channel"],
                {
                    "type": "game_event",
                    "event": "force_disconnect",
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
    
        game_state = await GameService.continue_game(
            room,
            self.send
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
    
        await BroadcastService.broadcast_game(self.code, self.channel_layer, "game_ended")

        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "game_event",
                "event": "force_disconnect",
                "payload": {
                    "message": "Room closed by host"
                }
            }
        )
    
    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"