import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player
from .models import PlayerPresence, Room, PlayerScore
from api.models import User
from asgiref.sync import sync_to_async
from game_engine.game import GameEngine
from api.serializers import UserSerializer

class RoomConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.code = self.scope["url_route"]["kwargs"]["code"]
        self.group_name = f"room_{self.code}"
        
        self.user = self.scope.get("user")
        if not self.user or not self.user.is_authenticated:
            await self.close(code=4001)
            return
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        room = await sync_to_async(Room.objects.get)(code=self.code)
        
        is_member = await sync_to_async(
            PlayerPresence.objects.filter(
                player=self.user,
                room=room
            ).exists
        )()
        
        if room.status == "end":
            await self.accept()
            await self.send(text_data=json.dumps({
                "event": "game_ended",
                "message": "La partie est déjà finie"
            }, ensure_ascii=False))
            await self.close(code=4003)
            return
        
        if room.status == "start" and not is_member:
            await self.accept()
            await self.send(text_data=json.dumps({
                "event": "game_started",
                "message": "La partie est déjà lancée"
            }, ensure_ascii=False))
            await self.close(code=4003)
            return
        await self.accept()

        await add_player_to_room(self.user, self.code)
        
        await sync_to_async(PlayerPresence.objects.filter(
            player=self.user,
            room=room
        ).update)(
            channel_name=self.channel_name
        )
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "user_joined",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )
        if room.status == "start":
            await self.send_data()

    async def disconnect(self, close_code):
        group_name = getattr(self, "group_name", None)
        code = getattr(self, "code", None)
        user = getattr(self, "user", None)
        #TODO change host if actual host disconnect
        if group_name:
            await self.channel_layer.group_discard(
                group_name,
                self.channel_name
            )

        if user and code:
            await remove_player_from_room(user, code)
            
            await sync_to_async(PlayerPresence.objects.filter(
                player=self.user,
                room__code=self.code
            ).update)(
                channel_name=None
            )
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

    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
        
            msg_type = data.get("type")
            action = data.get("action")
            payload = data.get("payload", {})

            if msg_type == "action":
                if action == "start_game":
                    await self.handle_start_game()
                if action == "play_card":
                    await self.handle_play_card(payload)
                if action == "continue":
                    await self.handle_continue_game()
                if action == "end_game":
                    await self.handle_end_game()
        
            else:
                await self.send(text_data=json.dumps({
                    "type": "error",
                    "message": "Unknown message type"
                }))

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "type": "error",
                "message": "Invalid JSON"
            }))



    async def private_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "private",
            "event": event["event"],
            "payload": event["payload"]
        }))

    async def room_event(self, event):
        await self.send(text_data=json.dumps({
            "type": "event",
            "event": event["event"],
            "payload": event.get("payload", {}),
        }))

    async def handle_start_game(self):
        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            await self.send(json.dumps({
                "event": "error",
                "message": "Only host can start game"
            }))
            return
    
        if room.status == "start":
            await self.send(json.dumps({
                "event": "error",
                "message": "Game already started"
            }))
            return
        
        game = GameEngine(room.uuid)
        game_state = game.handleAction("start", room.game_state, await count_player(room.code))
        
        for player_id, player_data in game_state["players"].items():
            presence = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(player_id)
            )
            
            user = await sync_to_async(lambda: presence.player)()
        
            await sync_to_async(PlayerScore.objects.get_or_create)(
                player=user,
                room=room
            )
        
        await start_room(room.uuid, game_state)
        
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
        await self.send_init()
    
    async def handle_play_card(self, payload: dict):
        room = await get_room_with_host(self.code)
        position = await get_player_pos(self.user, room.code)

        if int(position) != int(room.game_state["playing"]):
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "ce n'est pas à toi de jouer"
					}
                }
            )
            return

        game = GameEngine(room.uuid)
        
        legal = game.handleAction("legal", room.game_state, idPlayer=str(position))
        
        if payload["cardId"] >= len(legal) or payload["cardId"] < 0:
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "il n'y a pas de carte a cette position"
					}
                }
            )
            return
        
        if not legal[payload["cardId"]]:
            p = await sync_to_async(PlayerPresence.objects.get)(
                room=room,
                position=int(position)
            )
            await self.channel_layer.send(
                p.channel_name,
                {
                    "type": "room_event",
                    "event": "message",
                    "payload": {
                        "message": "tu ne peux pas jouer cette carte"
					}
                }
            )
            return
        
        game_state = game.handleAction("play", room.game_state, idPlayer= str(position), idCard= int(payload["cardId"]))
        #print(json.dumps(game_state, indent=6))
        await save_room_state(room.uuid, game_state)

        await self.send_data()

    async def handle_continue_game(self):
        room = await get_room_with_host(self.code)
    
        if self.user != room.host:
            await self.send(json.dumps({
                "event": "error",
                "message": "Only host can start game"
            }))
            return
        
        game = GameEngine(room.uuid)
        game_state = game.handleAction("start", room.game_state, await count_player(room.code))
                
        await start_room(room.uuid, game_state)
        
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
        await self.send_data()

    async def handle_end_game(self):
        room = await get_room_with_host(self.code)

        if self.user != room.host:
            await self.send(json.dumps({
                "event": "error",
                "message": "Only host can start game"
            }))
            return
        
        if room.status == "open" or room.status == "end":
            await self.send(json.dumps({
                "event": "error",
                "message": "Game not launch or already stopped"
            }))
            return

        await end_room(room.uuid, room.game_state)
        
        await self.channel_layer.group_send(
            self.group_name,
            {
                "type": "room_event",
                "event": "game_ended",
                "payload": {
                    "user": self.get_username(),
				}
            }
        )

    async def send_init(self):
        room = await get_room_with_host(self.code)
        game_state = room.game_state
        
        game = GameEngine(room.uuid)
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.get)(
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
                                "board": game_state["board"],
                                "taken": player_data["taken"],
                                "puntos": player_data["puntos"],
                                "legal": legal,
                                
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
                                "board": game_state["board"],
                                "taken": player_data["taken"],
                                "puntos": player_data["puntos"],
                            }
                        }
                    )

    async def send_data(self):
        room = await get_room_with_host(self.code)
        game_state = room.game_state
        
        game = GameEngine(room.uuid)
        for player_id, player_data in game_state["players"].items():
            p = await sync_to_async(PlayerPresence.objects.get)(
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
                                "board": game_state["board"],
                                "taken": player_data["taken"],
                                "puntos": player_data["puntos"],
                                "legal": legal,
                                
                            }
                        }
                    )
            else:
                await self.channel_layer.group_send(
                    self.group_name,
                    {
                        "type": "room_event",
                        "event": "board_data",
                        "payload": {
                            "board": game_state["board"],
		        		}
                    }
                )
    
    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"