# game/tasks.py

from celery import shared_task
from .db import  get_room_with_host, get_params
from .models import Room
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils import timezone
from datetime import datetime

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
                "type": "settings_event",
                "event": "host_changed",
                "payload": {"players": players, "params": async_to_sync(get_params)(room.code)}
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
            "type": "settings_event",
            "event": "room_closed",
            "payload": {
                "message": "Lobby timeout"
            }
        }
    )

#TODO check bug when no player in websocket room task for player (took too long to shut down and was killed)
@shared_task
def player_afk(room_code, user_id, round, game):
    room = Room.objects.select_related("host").filter(code=room_code).first()

    if not room or not room.round_time:
        return

    if round != room.game_state["round"]:
        return

    if game != room.game_state["game"]:
        return
    
    if timezone.now() < room.round_time:
        return
    
    if room.status != "start":
        return
    
    p = PlayerPresence.objects.filter(room=room, player_id=user_id).first()
    game_state = room.game_state
    
    if not p:
        return
    
    if str(p.position) != str(game_state["playing"]):
        return
    
    p.is_afk = True
    p.is_afk_count += 1
    p.save()
    
    channel_layer = get_channel_layer()
        
    async_to_sync(channel_layer.group_send)(
        f"player_{p.player_id}",
        {
            "type": "player_afk",
            "reason": "Player AFK",
            "code": room.code
        }
    )
    
@shared_task
def wait_time(room_code, round, game):
    room = Room.objects.select_related("host").filter(code=room_code).first()
    
    if round != room.game_state["round"]:
        room.wait_schedule = False
        room.save()
        return
        
    if game != room.game_state["game"]:
        room.wait_schedule = False
        room.save()
        return
    
    if room.wait_schedule == False:
        return
    
    room.wait_schedule = False
    room.save()
    
    




