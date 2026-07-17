import os
import asyncio
import django

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "backend.settings"
)

django.setup()

from game.redis_listener import listen_redis

if __name__ == "__main__":
    asyncio.run(listen_redis())