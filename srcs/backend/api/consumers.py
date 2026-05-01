from channels.generic.websocket import AsyncWebsocketConsumer
from .models import User, Friendship
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
        from django.utils import timezone

        await sync_to_async(
            User.objects.filter(id=self.user.id).update
        )(
            is_online=False,
        )