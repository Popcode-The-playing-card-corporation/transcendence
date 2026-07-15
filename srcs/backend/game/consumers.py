import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .db import get_room_with_host, get_player_pos, get_nb_human
from .models import PlayerPresence, Room
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from .services.game_service import GameService
from .services.room_service import RoomService
from .services.meld_service import MeldService
from .services.task_service import TaskService
from .services.bot_service import BotService
from .services.room_connection_service import RoomConnectionService
from .services.broadcast_service import BroadcastService
from .services.room_task_service import RoomTaskService
from django.utils import timezone
from datetime import timedelta

import asyncio

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

ACTION_HANDLERS = {
    "start_game": "handle_start_game",
    "play_card": "handle_play_card",
    "continue": "handle_create_room",
    "melds": "handle_melds",
    "kick": "handle_kick",
    "exit_game": "handle_exit_game",
    "patch_param": "handle_patch_param",
}

class RoomConsumer(AsyncWebsocketConsumer):
    
    async def send_json(self, data):
        await self.send(text_data=json.dumps(data))

    async def game_event(self, event):
        if event["event"] == "force_disconnect":
            await self.close(code=4001)
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
    
    async def afk_flow(self, room, game):
        await BotService.play_afk(room, room.game_state, game,
                                                        check_end=GameService.check_game_end, 
                                                        check_take_fold_callback=GameService.check_take_fold,
                                                        ask_continue=GameService.check_goal_reached
                                                        )
        
        p = await sync_to_async(PlayerPresence.objects.select_related("room").filter(room__code=room.code, player_id=self.user.id).first)()
        
        if p.is_afk_count >= 3:
            p.is_online = False
            await sync_to_async(p.save)()
            await self.channel_layer.group_send(
                f"player_{p.player_id}",
                {
                    "type": "game_event",
                    "event": "force_disconnect",
                    "payload": {
                        "message": "Player AFK 3 time"
                    }
                }
            )
            return
        
        room = await get_room_with_host(room.code)
        game = GameEngine(room.uuid)
        await BotService.play_until_human(room, room.game_state, game,
                                                        check_end=GameService.check_game_end, 
                                                        check_take_fold_callback=GameService.check_take_fold,
                                                        ask_continue=GameService.check_goal_reached
                                                        )
        room = await get_room_with_host(room.code)
        game = GameEngine(room.uuid)
        

        finished, game_state = await GameService.check_game_end(room, game)

        if finished and room.status == "start":
            await GameService.check_goal_reached(room.code)


    
    async def player_afk(self, event):
        room = await get_room_with_host(self.code)
        game = GameEngine(room.uuid)
        asyncio.create_task(self.afk_flow(room, game))
        
    

    async def connect(self):
        self.code = self.scope["url_route"]["kwargs"]["code"]
        self.group_name = f"room_{self.code}"
        self.user = self.scope.get("user")

        if not self.user.is_authenticated:
            await self.close(code=4003)
            return

        if not await sync_to_async(Room.objects.filter(code=self.code).exists)():
                await self.send_json({"error": "The room does not exist"})
                await self.close(code=4004)
                return
        
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
        
        await self.send_json({"type": "global", "event": "set_user", "username":self.get_username(), "id": self.user.id})
        
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
            await GameService.check_goal_reached(room.code)
            
        if room.status == "start":
            await BroadcastService.broadcast_game(self.code, self.channel_layer, "player_reconnect", self.user.username)
            room = await get_room_with_host(room.code)
            game = GameEngine(room.uuid)
            await RoomTaskService.cancel_disconnected(room.code, self.user.id)
            nb_human = await get_nb_human(room.uuid)
            if nb_human > 0:
                await sync_to_async(
                    Room.objects.filter(code=self.code).update
                )(is_paused=False)
                
            room = await get_room_with_host(room.code)
            asyncio.create_task(BotService.play_until_human(room, room.game_state, game,
                                                        check_end=GameService.check_game_end, 
                                                        check_take_fold_callback=GameService.check_take_fold,
                                                        ask_continue=GameService.check_goal_reached
                                                        ))
        
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
                nb_human = await get_nb_human(room.uuid)
                if nb_human > 0:
                    room = await get_room_with_host(room.code)
                    game = GameEngine(room.uuid)
                    await RoomTaskService.schedule_disconnected(room.code, self.user.id)
                else:
                    await sync_to_async(
                        Room.objects.filter(code=self.code).update
                    )(is_paused=True)
                    
            except Exception as e:
                print("ERROR:", e)
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
            if (type(action) != str):
                await self.send(text_data=json.dumps({
                        "type": "error",
                        "message": "Action not a string"
                    }))
                return 

            payload = data.get("payload", {})
            room = await get_room_with_host(self.code)
            if action == "play_card" and room.wait_schedule:
                await BroadcastService.broadcast_game(self.code, self.channel_layer, "card_invalid")
                return
            
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
        if (await RoomService.check_room_status("open", self.code) == False):
            await self.error("Forbidden")
            return

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
        if (await RoomService.check_room_status("start", self.code) == False):
            await self.error("Forbidden")
            return
        
        if (len(payload) == 0):
            await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "payload's empty"
                }))
            return 

        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)

        try:
            result = await GameService.play_card(
                room=room,
                user=self.user,
                position=position,
                card_id=payload["cardId"]
            )

        except KeyError:
            await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "cardId not found in payload"
                }))
            return 

        if result.get("error"):
            await self.error(result["error"])
            return
        
        if result.get("invalid"):
            return

        await BroadcastService.broadcast_game(self.code, self.channel_layer, "card_valid")

        room = await get_room_with_host(self.code)
        game_state = room.game_state

        take_fold, game_state = await GameService.check_take_fold(game_state, room)
        
        game = GameEngine(room.uuid)
        if (take_fold):
            room = await get_room_with_host(room.code)
            is_end, gs = await GameService.check_game_end(room, game)
            if (not is_end):
                room = await get_room_with_host(room.code)
                game_state = room.game_state
                room.round_time = (timezone.now() + timedelta(seconds=(25 if game_state["round"] == 0 else 10)))
                await sync_to_async(room.save)()
                await BroadcastService.broadcast_game(self.code, self.channel_layer, "start_round")
                await TaskService.player_afk(room.code)

        game_state = await BotService.play_until_human(room, game_state, game,
                                                       check_end=GameService.check_game_end, 
                                                       check_take_fold_callback=GameService.check_take_fold,
                                                        ask_continue=GameService.check_goal_reached
                                                       )

    async def handle_melds(self, payload):
        if (await RoomService.check_room_status("start", self.code) == False):
            await self.error("Forbidden")
            return

        if (len(payload) == 0):
            await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "payload's empty"
                }))
            return
        
        room = await get_room_with_host(self.code)
    
        try:
            result = await MeldService.verify_melds(
                room=room,
                user=self.user,
                cards=payload["cards"]
            )

        except KeyError:
            await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "cards not found in payload"
                }))
            return 
        
        await self.send(json.dumps(result))
        
        
    async def handle_exit_game(self, payload=None):  
        if (await RoomService.check_room_status("start", self.code) == False):
            await self.error("Forbidden")
            return

        result = await RoomService.handle_player_exit(
            code=self.code,
            user=self.user
        )
        if result:
            await self.channel_layer.group_send(
            f"player_{self.user.id}",
            {
                "type": "game_event",
                "event": "force_disconnect",
                "payload": {
                    "message": "Exit game"
                }
            }
        )
        
    async def handle_create_room(self, payload=None):
        if (await RoomService.check_room_status("end", self.code) == False):
            await self.error("Forbidden")
            return

        result = await RoomService.handle_create_room(
            code=self.code,
            user=self.user
        )
        if result:
            room = await sync_to_async(Room.objects.select_related("host").get)(code=result)
            await self.channel_layer.group_send(
            f"room_{self.code}",
            {
                "type": "game_event",
                "event": "new_room",
                "payload": {
                    "code": result,
                    "host": room.host.username,
                }
            }
        )

    async def handle_kick(self, payload: dict):
        if (await RoomService.check_room_status("open", self.code) == False):
            await self.error("Forbidden")
            return

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

    async def handle_patch_param(self, payload: dict):
        if (await RoomService.check_room_status("open", self.code) == False):
            await self.error("Forbidden")
            return

        room = await get_room_with_host(self.code)

        if room.host != self.user:
            await self.error("Only host can do this")
            return 

        if "max_player" in payload:
            if payload["max_player"] > 7 or payload["max_player"] < 1:
                await self.error("Invalid player max")
                return

        if "nb_games" in payload:
            if payload["nb_games"] < 0:
                await self.error("Invalid max games")
                return 
                
        if "nb_points" in payload:
            if payload["nb_points"] < 0:
                await self.error("Invalid max points")
                return 

        if "goal" in payload:
            if payload["goal"] != "games" and \
            payload["goal"] != "points":
                await self.error("Invalid type of goal")
                return 

        if "type" in payload:
            if payload["type"] not in ["public", "private", "friends_only"]:
                await self.error("Invalid type of game")
                return 



        await RoomService.handle_patch_room(room, payload)

    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"
