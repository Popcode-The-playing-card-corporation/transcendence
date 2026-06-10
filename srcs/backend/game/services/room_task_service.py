from asgiref.sync import sync_to_async
from ..models import Room
from game.tasks import delete_room, change_host, lobby_kick_all


class RoomTaskService:

    @staticmethod
    async def schedule_delete(room_code, delay=15):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.delete_scheduled = True
        await sync_to_async(room.save)()

        delete_room.apply_async(args=[room_code], countdown=delay)

    @staticmethod
    async def schedule_change_host(room_code, user_id, delay=5):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.host_change_scheduled = True
        await sync_to_async(room.save)()

        change_host.apply_async(args=[room_code, user_id], countdown=delay)

    @staticmethod
    async def schedule_lobby_kick_all(room_code, delay=900):
        #room = await sync_to_async(Room.objects.get)(code=room_code)

        lobby_kick_all.apply_async(args=[room_code], countdown=delay)






    @staticmethod
    async def cancel_delete(room_code):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.delete_scheduled = False
        await sync_to_async(room.save)()

    @staticmethod
    async def cancel_change_host(room_code):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.host_change_scheduled = False
        await sync_to_async(room.save)()