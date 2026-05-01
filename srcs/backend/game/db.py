from asgiref.sync import sync_to_async
from .models import PlayerPresence, Room
from django.db.models import Max

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
        if last_position != None:
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

@sync_to_async
def remove_player_from_room(user, code):
    try:
        room = Room.objects.get(code=code)
        if room.status == "start" or room.status == "end":
            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).update(is_online=False)
            return
        pos = PlayerPresence.objects.filter(player=user, room=room).values_list("position", flat=True).first()
        players = PlayerPresence.objects.filter(room=room, position__gt=pos).all()
        for p in players:
            p.position -= 1
            p.save()
        PlayerPresence.objects.filter(player=user, room=room).delete()
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
    room.save()
    
@sync_to_async
def save_room_state(uuid, data):
    room = Room.objects.get(uuid=uuid)
    room.game_state = data
    room.save()

