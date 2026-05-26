from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from ..models import Room, PlayerPresence
from api.models import User, Friendship
from ..serializers import RoomSerializer
from django.db.models import Q
from ..db import add_bot_to_room
import uuid

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_room(request):
    private = request.data.get("private")
    if private == None:
        private = 0
    room_code = str(uuid.uuid4())[:8]
    room = Room.objects.create(
        code=room_code,
        host=request.user,
        is_private=private,
    )
    return Response(RoomSerializer(room).data, status=201)

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def add_bot(request, code):
    room = Room.objects.get(
        code=code
    )
    
    if (room.nb_player == 7):
        return Response(
            {"message": "too many player in that room"},
            status= 401
        )
        
    if (room.host == request.user):
        last_bot = PlayerPresence.objects.filter(is_human=False, room=room).last()
        if (last_bot == None):
            user = User.objects.get(username= "BOT0")
        else:
            user = User.objects.get(id= int(last_bot.player_id))
            
            result = user.username.removeprefix("BOT")
            if (result == ""):
                nbr = 0
            else:
                nbr = int(result) + 1
            user = User.objects.get(username= f"BOT{nbr}")
        add_bot_to_room(user, code)
        room = Room.objects.get(
            code=code
        )
        ret = {}
        
        for i in range(room.nb_player):
            p =  PlayerPresence.objects.get(
                room=room,
                position= i
            )
            user = User.objects.get(id=p.player_id)
            ret[str(i)] = user.username
        return Response(ret, status=201)
    
    return Response(
        {"error": "You are not the host. BAD"},
        status=401
    )

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def is_presence(request):
    presence = PlayerPresence.objects.filter(
		room__status="open",
        player=request.user
	).exists()
    return Response({
        "presence": presence
    }, status=200)

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_public_room(request):
    rooms = Room.objects.filter(
        is_private=0,
        status="open"
    )
    data = []
    
    for room in rooms:
        players = PlayerPresence.objects.filter(
			room=room
		)
        list_player = [
			{
				"username": player.player.username,
			}
            for player in players
		]
        data.append(
            {
                "id": room.id,
                "code": room.code,
                "nb_player": room.nb_player,
                "list_player": list_player,
                "host": room.host.username,
            }
		)
    
    return Response(data, status=200)

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_friend_room(request):

    friendships = Friendship.objects.filter(
        Q(from_user=request.user) | Q(to_user=request.user),
        status="accepted"
    )

    friends = set()

    for f in friendships:
        if f.from_user == request.user:
            friends.add(f.to_user)
        else:
            friends.add(f.from_user)

    rooms = Room.objects.filter(
        status="open"
    )

    presences = PlayerPresence.objects.filter(
        room__in=rooms
    ).select_related("player", "room")

    room_map = {}

    for p in presences:

        room_id = p.room.id

        if room_id not in room_map:
            room_map[room_id] = {
                "room": p.room,
                "players": [],
                "has_friend": False
            }

        room_map[room_id]["players"].append(p)

        if p.player in friends:
            room_map[room_id]["has_friend"] = True

    data = []

    for value in room_map.values():

        if not value["has_friend"]:
            continue

        room = value["room"]

        list_player = [
            {
                "username": p.player.username
            }
            for p in value["players"]
        ]

        data.append({
            "id": room.id,
            "code": room.code,
            "nb_player": room.nb_player,
            "list_player": list_player,
            "host": room.host.username if room.host else None,
        })

    return Response(data, status=200)

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_my_started_room(request):

    rooms = Room.objects.filter(
        status="start"
    )

    presences = PlayerPresence.objects.filter(
        room__in=rooms,
    ).select_related("player", "room")

    room_map = {}

    for p in presences:
        print(p)
        room_id = p.room.id

        if room_id not in room_map:
            room_map[room_id] = {
                "room": p.room,
                "players": [],
                "present": False
            }

        room_map[room_id]["players"].append(p)

        if request.user == p.player:
            room_map[room_id]["present"] = True

    data = []

    for value in room_map.values():

        if not value["present"]:
            continue

        room = value["room"]

        list_player = [
            {
                "username": p.player.username
            }
            for p in value["players"]
        ]

        data.append({
            "id": room.id,
            "code": room.code,
            "nb_player": room.nb_player,
            "list_player": list_player,
            "host": room.host.username if room.host else None,
        })

    return Response(data, status=200)