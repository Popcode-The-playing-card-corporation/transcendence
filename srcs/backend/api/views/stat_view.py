from ..models import User
from game.models import Stat, PlayerScore, Room, Stat
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from game.serializers import StatSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated


@api_view(["GET"])
@permission_classes([AllowAny])
def leaderboard(request):
    top = list(
        User.objects
        .order_by("-elo")
        .values("id", "username", "elo")[:15]
    )

    if request.user.is_authenticated:
        user = request.user

        rank = User.objects.filter(elo__gt=user.elo).count() + 1

        me = {
            "id": user.id,
            "username": user.username,
            "elo": user.elo,
            "rank": rank
        }
    else:
        me = None

    return Response({
        "leaderboard": top,
        "user_rank": me
    })




@api_view(["GET"])
@permission_classes([IsAuthenticated])
def game_history(request):

    scores = (
        PlayerScore.objects
        .filter(player=request.user, room__status="end")
        .select_related("room")
        .order_by("-room__started_at")
    )

    history = []

    for ps in scores:
        room = ps.room

        duration = None

        if room.started_at and room.ended_at:
            duration = int(
                (room.ended_at - room.started_at).total_seconds()
            )

        history.append({
            "game_id": room.code,
            "uuid": str(room.uuid),
            "start": room.started_at.strftime("%d/%m/%Y %H:%M"),
            "points": ps.score,
            "rank": ps.rank,
            "duration": duration,
            "nb_player": room.nb_player
        })

    return Response(history)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def room_data(request, uuid):
    room = Room.objects.get(uuid=uuid)
    players = (
        PlayerScore.objects
        .filter(room=room)
        .order_by("rank")
	)
    
    users = []
    for ps in players:
        u = User.objects.get(id=ps.player_id)
        users.append({
			"id": ps.player_id,
            "username": u.username,
            "score": ps.score,
            "rank": ps.rank
		})
    return Response(users)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_stat(request, user_id):
    #user = User.objects.get(id=user_id)
    stats = Stat.objects.get(user_id=user_id)
    
    serializer = StatSerializer(stats)

    return Response(serializer.data)
    