from asgiref.sync import sync_to_async
from ..db import  remove_player_from_room, get_room_with_host
from ..serializers import RoomSerializer
from . broadcast_service import BroadcastService
import uuid
from ..models import PlayerPresence, Room
from api.models import User
from django.db.models import F
from channels.layers import get_channel_layer

from .room_task_service import RoomTaskService

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
        old_presence = await sync_to_async(
            lambda: User.objects.get(id=user.id).presence_game)()

        await sync_to_async(
            User.objects.filter(id=user.id).update
		)(presence_game=F("presence_game") - 1)
        
        if (old_presence == 1): 
            room = await get_room_with_host(code)
            if not room:
                return
            participants = await sync_to_async(list)(
                PlayerPresence.objects.filter(room=room)
                .select_related("player")
            )
    
            participant_users = [p.player for p in participants]
    
            old_host = room.host
            
            result = await remove_player_from_room(user, code)
            
            if result and result.get("should_change_host"):
                await RoomTaskService.schedule_change_host(
                    result["room_code"],
                    result["user"]
                )
    
    
            room = await get_room_with_host(code)
            bots = await sync_to_async(
                PlayerPresence.objects.filter(
                    room=room,
                    is_human=False
                ).count
            )()
            
            if room.status == "open" and room.nb_player - bots <= 0 and not room.cleanup_scheduled:
                await RoomTaskService.schedule_delete(room.code)
            if room.cleanup_scheduled and room.nb_player - bots <= 0:
                await sync_to_async(room.delete)()
                return
            await sync_to_async(
                PlayerPresence.objects.filter(
                    player=user,
                    room__code=code
                ).update
            )(
                channel_name=None
            )
    
            room = await get_room_with_host(code)
    
            participants = await sync_to_async(list)(
                PlayerPresence.objects.filter(room=room)
                .select_related("player")
            )
    
            participant_users = [p.player for p in participants]
            return {
                "room": room,
                "participant_users": participant_users,
                "host_changed": room and old_host != room.host,
                "old_host": old_host,
            }

    @staticmethod
    async def handle_player_exit(user, code):
        room = await get_room_with_host(code)
        p = await sync_to_async(PlayerPresence.objects.get)(player=user, room=room)
        bots = await sync_to_async(list)(User.objects.filter(is_bot=True))
        bots_room = await sync_to_async(list)((PlayerPresence.objects.filter(is_human=False, room=room)).select_related("player"))
        valid_bots = []
        remove_bots = []
        for bot in bots:
            for bot_room in bots_room:
                if bot.id == bot_room.player_id:
                    remove_bots.append(bot)
        for bot in bots:
            if (bot not in remove_bots):
                valid_bots.append(bot)
        
        p.player = valid_bots[0]
        p.channel_name = None
        p.is_human = False
        
        await sync_to_async(p.save)()
        
        return True
    
    @staticmethod
    async def handle_create_room(user, code):
        old_room = await get_room_with_host(code)
        room_code = str(uuid.uuid4())[:8]
        room = await sync_to_async(Room.objects.create)(
            code=room_code,
            host=user,
            max_player = old_room.max_player,
            type = old_room.type,
            goal = old_room.goal,
            nb_games = old_room.nb_games,
            nb_points = old_room.nb_points
            
        )
    
        return room.code

    @staticmethod
    async def handle_patch_room(room, payload):
        serializer = RoomSerializer(room, data=payload, partial=True)
        channel_layer = get_channel_layer()
        if ("max_player" in payload and payload["max_player"] < room.nb_player):
            await BroadcastService.broadcast_settings(room, channel_layer, "settings_error", f"room_{room.code}")
            return
        if serializer.is_valid():
            await sync_to_async(serializer.save)()
            await BroadcastService.broadcast_settings(room, channel_layer, "settings_changed", f"room_{room.code}")
        else:
            await BroadcastService.broadcast_settings(room, channel_layer, "settings_error", f"room_{room.code}")
   
    @staticmethod
    async def check_room_status(status, code):
        room = await sync_to_async(Room.objects.get)(code=code)

        if (room.status == status):
            return True
        return False