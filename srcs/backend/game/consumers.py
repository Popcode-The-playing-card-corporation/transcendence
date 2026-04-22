import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .db import add_player_to_room, remove_player_from_room  # adapte le path
from .models import PlayerPresence, Room
from asgiref.sync import sync_to_async

class RoomConsumer(AsyncWebsocketConsumer):
    async def room_event(self, event):
        await self.send(text_data=json.dumps({
            "event": event["event"],
            "user": event["user"]
        }))
    
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
                "user": self.get_username()
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
                "user": self.get_username()
            }
        )
    async def receive(self, text_data):
        try:
            data = json.loads(text_data)
            message = data.get("message")

            if not message:
                return

            await self.channel_layer.group_send(
                self.group_name,
                {
                    "type": "room_message",
                    "message": message,
                    "user": self.get_username()
                }
            )

        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                "error": "Invalid JSON"
            }))

    async def room_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"],
            "user": event["user"]
        }))

    def get_username(self):
        user = self.scope.get("user")
        return user.username if user and user.is_authenticated else "anonymous"