import os

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")

import django
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from .middleware import JwtAuthMiddleware
import game.routing
import api.routing

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JwtAuthMiddleware(
        URLRouter(
            game.routing.websocket_urlpatterns +
            api.routing.websocket_urlpatterns
            )
    ),
})