from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import User, Friendship
import json
from asgiref.sync import sync_to_async
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

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
                
        friendships = await sync_to_async(list)(
            Friendship.objects.filter(
                Q(from_user=self.user) |
                Q(to_user=self.user),
                status="accepted"
            ).select_related("from_user", "to_user")
        )
        
        for friendship in friendships:
            target = (
                friendship.to_user
                if friendship.from_user == self.user
                else friendship.from_user
            )
    
            if target.is_online:
    
                await self.channel_layer.group_send(
                    f"user_{target.id}",
                    {
                        "type": "notify",
                        "type_notify": "friend_online",
                        "event": "update",
                    }
                )
        

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