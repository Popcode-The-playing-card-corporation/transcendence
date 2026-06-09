
from django.urls import re_path
from .consumers import RoomConsumer
from .chat_consumers import ChatConsumer

websocket_urlpatterns = [
    re_path(r'ws/room/(?P<code>\w+)/$', RoomConsumer.as_asgi()),
	re_path(r'ws/chat/(?P<code>\w+)/$', ChatConsumer.as_asgi())
]