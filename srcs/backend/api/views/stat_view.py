from ..models import User, Friendship
from game.models import Stat, PlayerScore, Room, Stat
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from game.serializers import StatSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from api.auth.authentication import OptionalJWTAuthentication
from django.db.models import Q
from rest_framework.decorators import authentication_classes

@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([OptionalJWTAuthentication])
def leaderboard(request):

    top_users = (
        User.objects
        .order_by("-elo")
        .values("id", "username", "elo")[:15]
    )

    leaderboard = []

    current_rank = 0
    previous_elo = None

    for index, user in enumerate(top_users, start=1):

        if user["elo"] != previous_elo:
            current_rank = index

        leaderboard.append({
            "rank": current_rank,
            "id": user["id"],
            "username": user["username"],
            "elo": user["elo"],
        })

        previous_elo = user["elo"]

    if request.user.is_authenticated:

        user = request.user

        rank = (
            User.objects
            .filter(elo__gt=user.elo)
            .count() + 1
        )

        me = {
            "id": user.id,
            "username": user.username,
            "elo": user.elo,
            "rank": rank
        }

    else:
        me = None

    return Response({
        "leaderboard": leaderboard,
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
def game_history_friend(request, user_id):

    viewer = request.user

    is_friend = Friendship.objects.filter(
        status="accepted"
    ).filter(
        Q(from_user=viewer, to_user_id=user_id) |
        Q(from_user_id=user_id, to_user=viewer)
    ).exists()

    # autoriser accès seulement si ami OU soi-même
    if not is_friend and viewer.id != user_id:
        return Response(
            {"error": "Forbidden: not friends"},
            status=403
        )

    scores = (
        PlayerScore.objects
        .filter(player_id=user_id, room__status="end")
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
    user = None
    try:
        user = User.objects.get(id=user_id)

    except User.DoesNotExist:
        return Response(
            {
                "code": "user_not_found",
                "error": f"No user found with id {user_id}"
            },
            status=404
        )
    
    
    stats = Stat.objects.get(user=user)
    
    serializer = StatSerializer(stats)

    return Response(serializer.data)
    