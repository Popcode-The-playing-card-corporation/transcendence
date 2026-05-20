from asgiref.sync import sync_to_async
from .models import PlayerPresence, Room, PlayerScore, Stat
from api.models import User
from django.db.models import Max
from django.utils import timezone

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
            defaults={
                "position": next_position,
                "is_online": True
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

def add_bot_to_room(user, code):
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

@sync_to_async
def remove_player_from_room(user, code):
    try:
        room = Room.objects.get(code=code)

        if room.host == user:
            next_player = PlayerPresence.objects.filter(
                room=room,
                is_human=True
            ).exclude(player=user).order_by("position").first()

            if next_player:
                room.host = next_player.player
                room.save()
            else:
                room.delete()
                return

        if room.status in ["start", "end"]:
            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).update(is_online=False)
            return

        pos = PlayerPresence.objects.filter(
            player=user,
            room=room
        ).values_list("position", flat=True).first()

        players = PlayerPresence.objects.filter(
            room=room,
            position__gt=pos
        )

        for p in players:
            p.position -= 1
            p.save()

        PlayerPresence.objects.filter(
            player=user,
            room=room
        ).delete()

    except Room.DoesNotExist:
        pass


@sync_to_async
def get_room_with_host(code):
    return Room.objects.select_related("host").get(code=code)

@sync_to_async
def start_room(uuid, data):
    room = Room.objects.get(uuid=uuid)
    room.game_state = data
    room.status = "start"
    room.started_at = timezone.now()
    room.save()
    
@sync_to_async
def save_room_state(uuid, data):
    room = Room.objects.get(uuid=uuid)
    room.game_state = data
    room.save()

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
            player_id=pp.player_id
        )

        p.score = player_data["puntos"]
        p.save()
        
        stat = Stat.objects.get(user_id=p.player_id)
        stat.total_points += p.score
        stat.save()

        scores.append({
            "player_id": pp.player_id,
            "score": p.score
        })

    scores.sort(key=lambda x: x["score"], reverse=False)
    elo = room.nb_player
    if room.nb_player % 2 == 1:
        elo = room.nb_player + 1
    for rank, entry in enumerate(scores, start=1):
        PlayerScore.objects.filter(
            room=room,
            player_id=entry["player_id"]
        ).update(rank=rank)
        user = User.objects.get(id=entry["player_id"])
        stat = Stat.objects.get(user_id=user.id)
        
        user.elo += elo
        if elo > 0:
            stat.win += 1
        else:
            stat.lose += 1
            
        stat.played += 1
        
        elo -= 2
        if elo == 0:
            elo -= 2
            
        if room.host_id == user.id:
            stat.nb_host += 1
        user.save()
        stat.save()

    room.status = "end"
    room.ended_at = timezone.now()
    room.save()
