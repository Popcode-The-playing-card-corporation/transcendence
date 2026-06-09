from channels.generic.websocket import AsyncWebsocketConsumer
from ..models import User, Friendship
import json
from asgiref.sync import sync_to_async
from django.db.models import Q, F
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
        
        old_presence = await sync_to_async(
            lambda: User.objects.get(id=self.user.id).presence)()
        
        await sync_to_async(
            User.objects.filter(id=self.user.id).update
		)(presence=F("presence") + 1)
        
        if (old_presence == 0):
            await self.NotifyFriends()
       
        
    async def NotifyFriends(self):
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
        if not hasattr(self, "user") or not self.user.is_authenticated:
            return
        
        old_presence = await sync_to_async(
            lambda: User.objects.get(id=self.user.id).presence)()
        
        await sync_to_async(
            User.objects.filter(id=self.user.id).update
		)(presence=F("presence") - 1)

        if (old_presence <= 1):  
            await sync_to_async(
				User.objects.filter(id=self.user.id).update
			)(
				is_online=False,
			)
            await sync_to_async(
           		User.objects.filter(id=self.user.id).update
				)(presence=0)
            await self.NotifyFriends()
        
			
        
        
    async def receive(self, text_data):
        
        try:
            data = json.loads(text_data)
			
            if data.get("type") == "heartbeat":
                await self.send(text_data=json.dumps({
					"type": "acknowledge"
				}))
        finally:
            return