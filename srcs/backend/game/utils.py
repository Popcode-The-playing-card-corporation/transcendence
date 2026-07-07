from .db import get_room_with_host
from asgiref.sync import sync_to_async, async_to_sync

@sync_to_async
def reload_game_state(code):
    room = async_to_sync(get_room_with_host)(code)
    game_state = room.game_state
    
    return game_state