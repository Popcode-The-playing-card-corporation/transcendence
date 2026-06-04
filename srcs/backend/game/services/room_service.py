#TODO kick here
from asgiref.sync import sync_to_async
from ..db import add_player_to_room, remove_player_from_room, end_room, save_room_state, get_room_with_host, start_room, get_player_pos, count_player

from ..models import PlayerPresence

class RoomService:

    @staticmethod
    async def kick_player(room, host, player_position):
        if host != room.host:
            return {"error": "Only host can kick player"}

        if room.status == "start":
            return {"error": "Game started you cannot kick player"}

        presence = await sync_to_async(
            PlayerPresence.objects.select_related("player").filter(
                room=room,
                position=player_position
            ).first
        )()

        if not presence:
            return {"error": "Player not found"}

        if presence.player == host:
            return {"error": "You cannot kick yourself"}

        kicked_user = presence.player
        kicked_channel = presence.channel_name

        await remove_player_from_room(kicked_user, room.code)

        return {
            "error": None,
            "kicked_channel": kicked_channel,
            "payload": {
                "username": kicked_user.username,
                "message": f"{kicked_user.username} has been kicked"
            }
        }
    
    @staticmethod
    async def handle_player_disconnect(user, code):
        room = await get_room_with_host(code)

        participants = await sync_to_async(list)(
            PlayerPresence.objects.filter(room=room)
            .select_related("player")
        )

        participant_users = [p.player for p in participants]

        old_host = room.host

        await remove_player_from_room(user, code)

        await sync_to_async(
            PlayerPresence.objects.filter(
                player=user,
                room__code=code
            ).update
        )(
            channel_name=None
        )

        room = await get_room_with_host(code)

        return {
            "room": room,
            "participant_users": participant_users,
            "host_changed": room and old_host != room.host,
            "old_host": old_host,
        }