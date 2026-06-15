from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from ..models import Room, PlayerPresence, GameLog
from api.models import User, Friendship
from ..serializers import RoomSerializer
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ..db import add_bot_to_room, get_room_with_host
import uuid
from datetime import timedelta
from ..services.broadcast_service import BroadcastService

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_room(request):
    room_code = str(uuid.uuid4())[:8]
    room = Room.objects.create(
        code=room_code,
        host=request.user
    )
    
    friendships = list(
        Friendship.objects.filter(
            Q(from_user=request.user) |
            Q(to_user=request.user),
            status="accepted"
        ).select_related("from_user", "to_user")
    )
    channel_layer = get_channel_layer()
    for friendship in friendships:
        target = (
            friendship.to_user
            if friendship.from_user == request.user
            else friendship.from_user
        )

        if target.is_online:

            async_to_sync(channel_layer.group_send)(
                f"user_{target.id}",
                {
                    "type": "notify",
                    "event": "notification",
                    "type_notify": "game_created",
            
                    "payload": {
                        "code": room_code,
                        "from_user": request.user.username,
                        "from_user_id": request.user.id,
                        "message": f"{request.user.username} create a game"
                    }
                }
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
                {"error": "Invalid difficulty of bot"},
                status= 401
            )
        difficulty = request.data["difficulty"]
    room = Room.objects.get(
        code=code
    )

    if (room.nb_player + nb_bot) > room.max_player:
        return Response(
            {"error": "too many player in that room"},
            status= 401
        )

    if (room.nb_player == 7):
        return Response(
            {"error": "too many players in that room"},
            status= 401
        )
        
    if (room.host == request.user):
        bots = list(User.objects.filter(is_bot=True))
        bots_room = list((PlayerPresence.objects.filter(is_human=False, room=room)).select_related("player"))
        valid_bots = []
        remove_bots = []
        for bot in bots:
            for bot_room in bots_room:
                if bot.id == bot_room.player_id:
                    remove_bots.append(bot)
        for bot in bots:
            if (bot not in remove_bots):
                valid_bots.append(bot)
        while nb_bot > 0:
            add_bot_to_room(valid_bots[0], code, difficulty)
            valid_bots.remove(valid_bots[0])
            nb_bot -= 1
        
        channel_layer = get_channel_layer()
        BroadcastService.broadcast_settings(room.code, channel_layer, "bot_added", f"room_{room.code}",)

        return Response(status=200)
    
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
            "code": room.code,
            "type": "public",
            "is_friend": value["has_friend"],
            "nb_player": room.nb_player,
            "max_player": room.max_player,
            "list_player": list_player,
            "host": { "username":room.host.username, "id":room.host.id },
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
            "code": room.code,
            "type": "friends_only",
            "is_friend": True,
            "nb_player": room.nb_player,
            "max_player": room.max_player,
            "list_player": list_player,
            "host": { "username":room.host.username, "id":room.host.id },
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
    

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def list_my_started_room(request):

    presence = PlayerPresence.objects.select_related("room").filter(
        player=request.user,
        room__status="start"
    ).first()

    if (not presence) :
        return Response({"message": "failed", "code": ""}, status=200)
    data ={
        "message": "success",
        "code": presence.room.code,
    }

    return Response(data, status=200)

@api_view(["GET"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def validate_room(request, code):
    room = Room.objects.filter(
        code=code,
        status="open"
    ).first()

    if not room:
        return Response({
            "valid": False,
            "error": "Room no longer joinable",
        }, status=404)
    
    if room.max_player == room.nb_player:
        return Response({
            "valid": False,
            "error": "Room is full",
        }, status=401)

    return Response({
        "valid": True,
    }, status=200)

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
    room = Room.objects.get(code=code)
    
    if room.host != request.user:
        return Response(
            {"message": "Only host can do this"},
            status= 403
        )
    
    if "max_player" in request.data:
        if request.data["max_player"] > 7 or request.data["max_player"] < 1:
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
    
    
    serializer = RoomSerializer(room, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        channel_layer = get_channel_layer()

        BroadcastService.broadcast_settings(room.code, channel_layer, "settings_changed", f"room_{room.code}")
        
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def invite_friend(request, friend_id):
    
    if not Friendship.objects.filter(
            Q(from_user=request.user) | Q(to_user=request.user),
            status="accepted",
            id=friend_id,
        ).exists():
        return Response(
            {"message": "This is not your friend"},
            status= 404
		)
    
    friendship = Friendship.objects.get(
            Q(from_user=request.user) | Q(to_user=request.user),
            status="accepted",
            id=friend_id,
        )
    target = (
        friendship.to_user
        if friendship.from_user == request.user
        else friendship.from_user
    )
    p = PlayerPresence.objects.filter(
		player=request.user,
        room__status="open"
	).select_related("player", "room").last()
    
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"user_{target.id}",
        {
            "type": "notify",
            "event": "notification",
            "type_notify": "friend_invite",
    
            "payload": {
                "code": p.room.code,
                "from_user": request.user.username,
                "from_user_id": request.user.id,
                "message": f"{request.user.username} invited you"
            }
        }
    )
    
    return Response({"success": True}, status=200)

