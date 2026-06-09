from asgiref.sync import sync_to_async
from ..db import  remove_player_from_room, get_room_with_host

from ..models import PlayerPresence, Room
from api.models import User
from django.db.models import F

from ..room_tasks import ROOM_DELETE_TASKS
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
            
            await remove_player_from_room(user, code)
    
            room = await get_room_with_host(code)
            
            if room.status == "open" and room.nb_player == 0:
                asyncio.create_task(RoomService.schedule_room_delete(room.id))
            
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
            "type": room.type
        }

    @staticmethod
    async def delete_room_later(room_id, delay=30):
        await asyncio.sleep(delay)
        
        try:
            room = await sync_to_async(Room.objects.get)(id=room_id)
    
            if room.status == "open":
                await sync_to_async(room.delete)()
    
        except Room.DoesNotExist:
            pass



    @staticmethod
    async def schedule_room_delete(room_id, delay=15):
        task = asyncio.create_task(RoomService.delete_room_later(room_id, delay))
        ROOM_DELETE_TASKS[room_id] = task
        
        
    @staticmethod
    def cancel_room_delete(room_id):
        task = ROOM_DELETE_TASKS.get(room_id)
    
        if task:
            task.cancel()
            del ROOM_DELETE_TASKS[room_id]