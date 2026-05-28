from ..models import User, Friendship
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import FriendSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_friends(request):
    friendships = Friendship.objects.filter(
        Q(from_user=request.user) | Q(to_user=request.user),
        Q(status="accepted") | Q(status="pending")
    )

    serializer = FriendSerializer(
        friendships,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def send_friend_request(request, user_id):
    try:
        target = User.objects.get(id=user_id, is_bot=False,)

        if target == request.user:
            return Response({"error": "You can't add yourself"}, status=400)

        if Friendship.objects.filter(
            from_user=request.user,
            to_user=target
        ).exists():
            return Response({"error": "Request already sent"}, status=400)

        if Friendship.objects.filter(
            from_user=target,
            to_user=request.user
        ).exists():
            return Response({"error": "This user already sent you a request"}, status=400)

        Friendship.objects.create(
            from_user=request.user,
            to_user=target,
            status="pending"
        )

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user_{target.id}",
            {
                "type": "notify",
        
                "event": "friend_request",
        
                "payload": {
                    "from_user": request.user.username,
                    "from_user_id": request.user.id,
                    "message": f"{request.user.username} sent you a friend request"
                }
            }
        )
        
        return Response({"message": "Friend request sent"})

    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def accept_friend_request(request, request_id):
    try:
        friendship = Friendship.objects.get(
            id=request_id,
            to_user=request.user,
            status="pending"
        )
        friendship.status = "accepted"
        friendship.accepted_at = timezone.now()
        friendship.save()

        channel_layer = get_channel_layer()

        async_to_sync(channel_layer.group_send)(
            f"user_{friendship.from_user.id}",
            {
                "type": "notify",
        
                "event": "friend_accepted",
        
                "payload": {
                    "message": f"{request.user.username} accept your friend request"
                }
            }
        )
        
        return Response({"message": "Friend request accepted"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_friend_request(request, request_id):
    try:
        friendship = Friendship.objects.get(
            Q(from_user=request.user) | Q(to_user=request.user),
            Q(status="accepted") | Q(status="pending") | Q(status="blocked"),
            id=request_id,
        )

        friendship.delete()

        return Response({"message": "Friend request delete"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def block_friend(request, user_id):

    if request.user.id == user_id:
        return Response(
            {"error": "You cannot block yourself"},
            status=400
        )

    try:
        user = User.objects.get(id=user_id)

    except User.DoesNotExist:
        return Response(
            {"error": "User not found"},
            status=404
        )

    friendship = Friendship.objects.filter(
        Q(from_user=request.user, to_user=user) |
        Q(from_user=user, to_user=request.user)
    ).first()

    if friendship:
        if friendship.status == "blocked":
            return Response(
                {"error": "User already blocked"},
                status=400
            )
        friendship.status = "blocked"
        friendship.blocked_by = request.user
        friendship.blocked_at = timezone.now()
        friendship.save()

    else:
        friendship = Friendship.objects.create(
            from_user=request.user,
            to_user=user,
            status="blocked",
            blocked_by=request.user,
            blocked_at=timezone.now(),
        )

    return Response({
        "message": "User blocked"
    })

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def unblock_friend(request, request_id):
    try:
        friendship = Friendship.objects.get(
            Q(from_user=request.user) | Q(to_user=request.user),
            status="blocked",
            id=request_id,
            blocked_by=request.user,
        )

        friendship.delete()

        return Response({"message": "Friend unblock"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_blocked(request):
    friendships = Friendship.objects.filter(
        Q(from_user=request.user) | Q(to_user=request.user),
        status="blocked",
        blocked_by=request.user,
    )

    serializer = FriendSerializer(
        friendships,
        many=True,
        context={"request": request}
    )

    return Response(serializer.data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_user(request, name):

    user = request.user

    related_users = Friendship.objects.filter(
        Q(from_user=user) | Q(to_user=user)
    ).values_list("from_user", "to_user")

    related_ids = set()
    for from_id, to_id in related_users:
        related_ids.add(from_id)
        related_ids.add(to_id)

    users = User.objects.exclude(
        Q(id__in=related_ids) | Q(id=user.id)
    ).filter(username__contains=name)

    data = [
        {
            "id": u.id,
            "username": u.username,
            "is_online": u.is_online,
        }
        for u in users
    ]

    return Response(data)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def list_propal(request):

    friendships = Friendship.objects.filter(
        Q(from_user=request.user) | Q(to_user=request.user),
        status="accepted"
    )

    my_friend_ids = set()

    for friendship in friendships:
        if friendship.from_user == request.user:
            my_friend_ids.add(friendship.to_user.id)
        else:
            my_friend_ids.add(friendship.from_user.id)

    my_friend_ids.add(request.user.id)

    suggestions = []

    for friend_id in my_friend_ids.copy():

        propals = Friendship.objects.filter(
            Q(from_user_id=friend_id) |
            Q(to_user_id=friend_id),
            status="accepted"
        )

        for friendship in propals:

            if friendship.from_user.id == friend_id:
                suggested_user = friendship.to_user
            else:
                suggested_user = friendship.from_user

            if suggested_user.id not in my_friend_ids:

                suggested_friendships = Friendship.objects.filter(
                    Q(from_user=suggested_user) |
                    Q(to_user=suggested_user),
                    status="accepted"
                )

                suggested_friend_ids = set()

                for sf in suggested_friendships:

                    if sf.from_user == suggested_user:
                        suggested_friend_ids.add(sf.to_user.id)
                    else:
                        suggested_friend_ids.add(sf.from_user.id)

                mutual_ids = my_friend_ids.intersection(
                    suggested_friend_ids
                )

                mutual_users = User.objects.filter(
                    id__in=mutual_ids
                )

                suggestions.append({
                    "id": suggested_user.id,
                    "username": suggested_user.username,

                    "mutual_friends": [
                        {
                            "id": user.id,
                            "username": user.username,
                        }
                        for user in mutual_users
                    ],

                    "mutual_count": len(mutual_ids)
                })

                my_friend_ids.add(suggested_user.id)

    return Response(suggestions)