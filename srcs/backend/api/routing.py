from django.urls import path
from .consumers.presence_consumers import PresenceConsumer
from .consumers.notification_consumers import NotificationConsumer

websocket_urlpatterns = [
    path("ws/presence/", PresenceConsumer.as_asgi()),
    path("ws/notification/", NotificationConsumer.as_asgi()),
]