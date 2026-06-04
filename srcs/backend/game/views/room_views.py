from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from ..models import Room, PlayerPresence, GameLog
from api.models import User, Friendship
from ..serializers import RoomSerializer
from django.db.models import Q
from ..db import add_bot_to_room
import uuid

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_room(request):
    room_code = str(uuid.uuid4())[:8]
    room = Room.objects.create(
        code=room_code,
        host=request.user
    )
    return Response(RoomSerializer(room).data, status=201)

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def add_bot(request, code, nb_bot):
    difficulty = "medium"
    if "difficulty" in request.data:
        if request.data["difficulty"] != "easy" and request.data["difficulty"] != "medium" and request.data["difficulty"] != "hard":
            return Response(
                {"message": "Invalid difficulty of bot"},
                status= 401
            )
        difficulty = request.data["difficulty"]
    room = Room.objects.get(
        code=code
    )
    if room.nb_player + nb_bot >= room.max_player:
        return Response(
            {"message": "too many player in that room"},
            status= 401
        )

    if (room.nb_player == 7):
        return Response(
            {"message": "too many player in that room"},
            status= 401
        )
        
    if (room.host == request.user):

        while nb_bot > 0:
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
            add_bot_to_room(user, code, difficulty)
            room = Room.objects.get(
                code=code
            )
            
            nb_bot -= 1
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
def get_game_scorelog(request, code):
    if not Room.objects.filter(
		code=code
	).exists():
        return Response(
            {"message": "No room with this code"},
            status= 401
        )
    room = Room.objects.get(code=code)
        
    players = PlayerPresence.objects.filter(
        room=room
    )
    
    data = []
    
    for player in players:
        scores = GameLog.objects.filter(
	    	room=room,
            player=player.player,
	    )

        list_score = [
            {
                "game": score.game,
                "round": score.round,
                "meld": score.meld,
            }
            for score in scores
        ]
        data.append(
            {
                "id": room.id,
                "username": player.player.username,
                "list_score": list_score,
            }
	    )

    return Response({
        "scores": data
    }, status=200)

def list_public_room(request, data):
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
        type="public",
        status="open"
    ).exclude(
        host=request.user
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

        if p.room.host in friends:
            room_map[room_id]["has_friend"] = True

    for value in room_map.values():

        room = value["room"]

        list_player = [
            {
                "id": p.player.id,
                "username": p.player.username
            }
            for p in value["players"]
        ]

        data.append({
            "id": room.id,
            "code": room.code,
            "type": "public",
            "is_friend": value["has_friend"],
            "nb_player": room.nb_player,
            "list_player": list_player,
            "host": room.host.username if room.host else None,
        })
    
    return data

def list_friend_room(request, data):

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
        type="friends_only",
        status="open"
    ).exclude(
        host=request.user
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

        if p.room.host in friends:
            room_map[room_id]["has_friend"] = True

    for value in room_map.values():

        if not value["has_friend"]:
            continue
        
        room = value["room"]
        list_player = [
            {
                "id": p.player.id,
                "username": p.player.username
            }
            for p in value["players"]
        ]

        data.append({
            "id": room.id,
            "code": room.code,
            "type": "friends_only",
            "is_friend": True,
            "nb_player": room.nb_player,
            "max_player": room.max_player,
            "list_player": list_player,
            "host": { "username":room.host.username, "id":room.host.id } if room.host else None,
        })

    return data

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_room(request):
    data = []
    data = list_friend_room(request, data)
    data = list_public_room(request, data)

    return Response(data, status=200)
    

#TODO only one game start at the time in the db by user
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

@api_view(["PATCH"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def update_params(request, code):
    if not Room.objects.filter(
        code=code
    ).exists():
        return Response(
            {"message": "No room with this code"},
            status= 401
        )
    if "max_player" in request.data:
        if request.data["max_player"] > 7 or request.data["max_player"] < 2:
            return Response(
                {"message": "Invalid number of player max"},
                status= 401
            )
    if "type" in request.data:
        if request.data["type"] != "public" and request.data["type"] != "private" and request.data["type"] != "friends_only":
            return Response(
                {"message": "Invalid type of game"},
                status= 401
            )
    
    if "status" in request.data:
        if request.data["status"] != "created" and request.data["status"] != "open" and request.data["status"] != "start" and request.data["status"] != "close":
            return Response(
                {"message": "Invalid status of game"},
                status= 401
            )
    
    room = Room.objects.get(code=code)
    serializer = RoomSerializer(room, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

