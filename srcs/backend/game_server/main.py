import os
import sys
import asyncio

os.environ.setdefault(
    "DJANGO_SETTINGS_MODULE",
    "backend.settings"
)

import django
django.setup()


from game_server.listener import listen_room
from game_server.manager import GameManager
async def main():

    manager = GameManager()

    await listen_room(
        room_id=123,
        manager=manager
    )


if __name__ == "__main__":
    asyncio.run(main())