from asgiref.sync import sync_to_async
from ..db import  remove_player_from_room, get_room_with_host
from datetime import timedelta

from ..models import PlayerPresence, Room
from api.models import User
from django.db.models import F

from channels.layers import get_channel_layer
from .room_task_service import RoomTaskService

from ..room_tasks import ROOM_DELETE_TASKS, ROOM_CHANGE_HOST_TASKS
import asyncio

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
    async def get_players(room):
        if room == None:
            return {"error": "No room send"}

        presences = await sync_to_async(list)(
            PlayerPresence.objects.select_related("player").filter(
                room=room
            )
        )
        
        players = []
        
        for p in presences:
            players.append({
				"id": p.player.id,
                "username": p.player.username,
                "is_host": p.player == room.host,
                "position": p.position
			})


        return players

    @staticmethod
    async def get_room_snapshot(room):
        
        return {
            "code": room.code,
            "status": room.status,
            "max_player": room.max_player,
            "type": room.type,
            "timestamp": (room.created_at + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
        }
    
    @staticmethod
    async def broadcast_player_list(room, channel_layer):
        players = await RoomService.get_players(room)

        await channel_layer.group_send(
            f"room_{room.code}",
            {
                "type": "list_player_event",
                "event": "update",
                "payload": {
                    "players": players
                }
            }
        )
    