# game/tasks.py

from celery import shared_task
from .db import  get_room_with_host
from .models import Room
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

from .models import PlayerPresence
from api.models import User


@shared_task
def delete_room(room_code):
    try:
        room = Room.objects.select_related("host").filter(code=room_code).first()
        
        if not room.delete_scheduled:
            return
        if room.status != "open":
            return
        
        bots = PlayerPresence.objects.filter(room=room, is_human=False).count()
    
        real_players = room.nb_player - bots

        if room.status == "open" and real_players <= 0:
            room.delete()

    except Room.DoesNotExist:
        pass
    
    
@shared_task
def change_host(room_code, user_id):
    try:
        room = Room.objects.select_related("host").filter(code=room_code).first()
        user = User.objects.get(id=user_id)

        if room.status != "open":
            return

        next_player = (
            PlayerPresence.objects
            .select_related("player")
            .filter(room=room, is_human=True)
            .exclude(player=user)
            .order_by("position")
            .first()
        )

        if next_player:
            room.host = next_player.player
            room.save()

        channel_layer = get_channel_layer()
        presences = list(
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
            
        async_to_sync(channel_layer.group_send)(
            f"room_{room.code}",
            {
                "type": "list_player_event",
                "event": "update",
                "payload": {"players": players}
            }
        )

    except (Room.DoesNotExist, User.DoesNotExist):
        pass
    
    
@shared_task
def lobby_kick_all(room_code):
    room = Room.objects.select_related("host").filter(code=room_code).first()
    
    if not room:
        return
    
    if room.status != "open":
        return
    
    room.cleanup_scheduled = True
    room.save()
    
    channel_layer = get_channel_layer()
    
    async_to_sync(channel_layer.group_send)(
        f"room_{room.code}",
        {
            "type": "room_closed",
            "reason": "Lobby timeout"
        }
    )


    
    
    
    
    
    