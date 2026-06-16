from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import User
import json
from asgiref.sync import sync_to_async

from django.contrib.auth import get_user_model

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):

        self.user = self.scope["user"]

        if not self.user.is_authenticated:
            await self.close()
            return
    
        self.user_group = f"user_{self.user.id}"
    
        await self.channel_layer.group_add(
            self.user_group,
            self.channel_name
        )
    
        await self.accept()

    async def disconnect(self, close_code):
    
        if self.user_group:
            await self.channel_layer.group_discard(
				self.user_group,
				self.channel_name
			)
    
    async def notify(self, event):

        await self.send(text_data=json.dumps({
            "type": event["type_notify"],
            "event": event["event"],
            "payload": event.get("payload")
        }))
        
    async def receive(self, text_data):
        
        try:
            data = json.loads(text_data)
			
            if data.get("type") == "heartbeat":
                await self.send(text_data=json.dumps({
					"type": "acknowledge"
				}))
        finally:
            return