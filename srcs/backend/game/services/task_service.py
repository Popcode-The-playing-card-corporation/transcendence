from ..db import get_room_with_host
from ..models import PlayerPresence
from asgiref.sync import sync_to_async
from .room_task_service import RoomTaskService
from ..utils import reload_game_state

class TaskService:

    @staticmethod
    async def player_afk(code):
        room = await get_room_with_host(code)
        if (room.status == "abandoned"):
            return
        game_state = await reload_game_state(code)
        p = await sync_to_async(PlayerPresence.objects.select_related("player").get)(
            room=room,
            position=int(game_state["playing"])
        )
        # if p.is_human and p.is_online:
            # await RoomTaskService.schedule_play_for_player(room.code, p.player_id, game_state["round"], game_state["game"], 25 if game_state["round"] == 0 else 10)