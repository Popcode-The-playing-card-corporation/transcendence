import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .db import add_player_to_room, remove_player_from_room, get_room_with_host, start_room
from .models import PlayerPresence, Room
from asgiref.sync import sync_to_async

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
        
        if room.is_started and not is_member:
            await self.accept()
            await self.send(text_data=json.dumps({
                "event": "game_started",
                "message": "La partie est déjà lancée"
            }, ensure_ascii=False))
            await self.close(code=4003)
            return
        await self.accept()

        await add_player_to_room(self.user, self.code)
        
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

    async def disconnect(self, close_code):
        group_name = getattr(self, "group_name", None)
        code = getattr(self, "code", None)
        user = getattr(self, "user", None)

        if group_name:
            await self.channel_layer.group_discard(
                group_name,
                self.channel_name
            )

        if user and code:
            await remove_player_from_room(user, code)
            
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
                    await self.channel_layer.group_send(
                        self.group_name,
                        {
                            "type": "room_event",
                            "event": "play_card",
                            "payload": payload
                        }
                    )
        
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
    
        if room.is_started:
            await self.send(json.dumps({
                "event": "error",
                "message": "Game already started"
            }))
            return
        game_state = {
            "players": {
                "0": {
                    "cards": [{"color": "diamond", "value": 6}],
                    "taken": [],
                    "points": 0
                },
                "1": {
                    "cards": [{"color": "heart", "value": 6}],
                    "taken": [],
                    "points": 0
				}
            },
            "lastCard": {"color": "club", "value": 7},
            "playing": 0,
            "board": {
                "2": {"color": "spade", "value": 6},
                "3": {"color": "spade", "value": 9}
            }
        }
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
    
    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"