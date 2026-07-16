from asgiref.sync import sync_to_async
from ..models import Room, PlayerPresence
from game.tasks import delete_room, change_host, lobby_kick_all, disconnected_player, wait_time


class RoomTaskService:

    @staticmethod
    async def schedule_delete(room_code, delay=15):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.delete_scheduled = True
        await sync_to_async(room.save)()

        delete_room.apply_async(args=[room_code], countdown=delay)

    @staticmethod
    async def schedule_change_host(room_code, user, delay=5):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.host_change_scheduled = True
        await sync_to_async(room.save)()

        change_host.apply_async(args=[room_code, user.id], countdown=delay)

    @staticmethod
    async def schedule_lobby_kick_all(room_code, delay=900):
        lobby_kick_all.apply_async(args=[room_code], countdown=delay)

    @staticmethod
    async def schedule_wait_time(room_code, round, game, delay=7):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.wait_schedule = True
        await sync_to_async(room.save)()

        wait_time.apply_async(args=[room_code, round, game], countdown=delay)

    @staticmethod
    async def schedule_disconnected(room_code, player_id, delay=7):
        room = await sync_to_async(Room.objects.get)(code=room_code)
        presence = await sync_to_async(PlayerPresence.objects.filter(room=room, player_id=player_id).first)()
        
        presence.disconnected_scheduled = True
        await sync_to_async(presence.save)()

        disconnected_player.apply_async(args=[room_code, player_id], countdown=delay)

    @staticmethod
    async def cancel_disconnected(room_code, player_id):
        room = await sync_to_async(Room.objects.get)(code=room_code)
        presence = await sync_to_async(PlayerPresence.objects.filter(room=room, player_id=player_id).first)()
        
        presence.disconnected_scheduled = False
        await sync_to_async(presence.save)()

    @staticmethod
    async def cancel_wait_time(room_code):
        room = await sync_to_async(Room.objects.get)(code=room_code)

        room.wait_schedule = False
        await sync_to_async(room.save)()

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