import os
from pathlib import Path
import tempfile
from asgiref.sync import sync_to_async
from .models import PlayerPresence, Room, PlayerScore, Stat, GameLog
from api.models import User
from django.db.models import Max
from django.utils import timezone
from datetime import timedelta
import asyncio

@sync_to_async
def get_params(code):
    room = Room.objects.select_related("host").get(code=code)
    params = {
            "code": room.code,
            "status": room.status,
            "max_player": room.max_player,
            "type": room.type,
            "timestamp": (room.created_at + timedelta(minutes=15)).strftime("%Y-%m-%d %H:%M:%S")
	}
    return params

@sync_to_async
def count_player(code):
    try:
        room = Room.objects.get(code=code)
        count = PlayerPresence.objects.filter(room=room).count()
        return count
    except Room.DoesNotExist:
        return False

@sync_to_async
def get_player_pos(user, code):
    try:
        room = Room.objects.get(code=code)
        player = PlayerPresence.objects.filter(
                player=user.id,
                room=room
            ).first()
        return player.position
    except Room.DoesNotExist:
        return False
    

@sync_to_async
def add_player_to_room(user, code):
    try:
        room = Room.objects.get(code=code)

        next_position = 0
        
        if room.nb_player != 0:
            last_position = PlayerPresence.objects.filter(
                room=room
            ).aggregate(Max("position"))["position__max"]
            if last_position is not None:
                next_position = (last_position or 0) + 1
        
        if room.status == "start":
            exists = PlayerPresence.objects.filter(
                player=user,
                room=room
            ).exists()

            if not exists:
                return False

            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).update(is_online=True)

            return True

        obj, created = PlayerPresence.objects.get_or_create(
            player=user,
            room=room,
            defaults={
                "position": next_position,
                "is_online": True
            }
        )
        
        if room.nb_player == 0:
            room.host = user
            room.save()
        
        room.nb_player = PlayerPresence.objects.filter(room=room).count()
        room.save()
    
        if not created:
            obj.is_online = True
            obj.save()

        return True

    except Room.DoesNotExist:
        return False

def add_bot_to_room(user, code, difficulty):
    try:
        room = Room.objects.get(code=code)

        last_position = PlayerPresence.objects.filter(
            room=room
        ).aggregate(Max("position"))["position__max"]
        next_position = 0
        if last_position is not None:
            next_position = (last_position or 0) + 1
        
        if room.status == "start":
            exists = PlayerPresence.objects.filter(
                player=user,
                room=room
            ).exists()

            if not exists:
                return False

            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).update(is_online=True)

            return True

        obj, created = PlayerPresence.objects.get_or_create(
            player=user,
            room=room,
            difficulty=difficulty,
            defaults={
                "position": next_position,
                "is_online": False,
                "is_human": False
            }
        )
        room.nb_player = PlayerPresence.objects.filter(room=room).count()
        room.save()

        if not created:
            obj.is_online = True
            obj.save()

        return True

    except Room.DoesNotExist:
        return False

def getFile(code):
		tmp_dir = Path(tempfile.gettempdir())

		file_name = f"chat_{code}.tmp"
		file = tmp_dir / file_name

		return file

@sync_to_async
def remove_player_from_room(user, code):
    if not user or not code:
        return
    try:
        should_change_host = False
        room = Room.objects.select_related("host").get(code=code)
        if room.status == "start":
            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).update(is_online=False)
             
        if room.status not in ["start", "end"]:
            pos = PlayerPresence.objects.filter(
                player=user,
                room=room
            ).values_list("position", flat=True).first()
            if room.host == user:
                next_player = PlayerPresence.objects.filter(
                    room=room,
                    is_human=True
                ).exclude(player=user).order_by("position").first()

                if next_player:
                    bots = PlayerPresence.objects.filter(
                        room=room,
                        is_human=False
                    ).count()
                    
                    if room.status == "open" and room.nb_player - bots > 0:
                        should_change_host = True
                else:
                    room.nb_player -= 1
                    room.save()
                    
                    PlayerPresence.objects.filter(
                        player=user,
                        room=room
                    ).delete()
    
            
            if pos is None:
                PlayerPresence.objects.filter(
                    player=user,
                    room=room
                ).delete()
                return
            
            players = PlayerPresence.objects.filter(
                room=room,
                position__gt=pos
            )
            
            for p in players:
                p.position -= 1
                p.save()
    
            room.nb_player -= 1
            room.save()
            
            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).delete()
        return {
            "should_change_host": should_change_host,
            "room_code": room.code,
            "user": user
        }
    except Room.DoesNotExist:
        pass


@sync_to_async
def get_room_with_host(code):
    return Room.objects.select_related("host").filter(code=code).first()

@sync_to_async
def start_room(uuid, data):
    room = Room.objects.get(uuid=uuid)
    room.game_state = data
    if room.status == "open":
        room.status = "start"
        room.started_at = timezone.now()
    room.save()
    
@sync_to_async
def save_room_state(uuid, data):
    room = Room.objects.get(uuid=uuid)
    room.game_state = data
    room.save()

@sync_to_async
def get_nb_human(uuid):
    room = Room.objects.get(uuid=uuid)
    player = PlayerPresence.objects.filter(
            room=room,
            is_human=True,
            is_online=True
        ).count()
    
    return player

@sync_to_async
def delete_room(room_code):
    try:
        room = Room.objects.get(code=room_code)
        room.delete()
        return True
    except Room.DoesNotExist:
        return False

@sync_to_async
def end_room(uuid, data):
    room = Room.objects.get(uuid=uuid)

    scores = []

    for player_id, player_data in data["players"].items():
        pp = PlayerPresence.objects.get(
            room=room,
            position=int(player_id)
        )

        p, _ = PlayerScore.objects.get_or_create(
            room=room,
            player=pp
        )

        p.score = player_data["puntos"]
        p.save()
        
        stat = Stat.objects.get(user_id=pp.player_id)
        stat.total_points += p.score
        stat.save()

        scores.append({
            "player": pp,
            "score": p.score
        })

    scores.sort(key=lambda x: x["score"], reverse=False)
    
    bots = PlayerPresence.objects.filter(
            room=room,
            is_human=False
        ).count()
    elo = room.nb_player - bots
    if (room.nb_player - bots) % 2 == 1:
        elo -= 1
    for rank, entry in enumerate(scores, start=1):
        PlayerScore.objects.filter(
            room=room,
            player=entry["player"]
        ).update(rank=rank)
        user = User.objects.get(id=entry["player"].player_id)
        stat = Stat.objects.get(user_id=user.id)
        
        if not user.is_bot:
            user.elo += elo
        
        if elo > 0:
            stat.win += 1
        else:
            stat.lose += 1
            
        stat.played += 1
        
        if not user.is_bot:
            elo -= 2
            
        if room.host_id == user.id:
            stat.nb_host += 1
        user.save()
        stat.save()

    room.status = "end"
    room.ended_at = timezone.now()
    room.save()
