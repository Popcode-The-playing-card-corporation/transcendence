from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import User
import json
from asgiref.sync import sync_to_async

from django.contrib.auth import get_user_model

User = get_user_model()

class PresenceConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return

        await self.accept()

        await sync_to_async(
            User.objects.filter(id=self.user.id).update
        )(is_online=True)

    async def disconnect(self, close_code):

        await sync_to_async(
            User.objects.filter(id=self.user.id).update
        )(
            is_online=False,
        )
        
    async def receive(self, data):
        data = json.loads(data)
        
        if data.get("type") == "heartbeat":
             await self.send(data=json.dumps({
                  "type": "acknowledge"
			 }))