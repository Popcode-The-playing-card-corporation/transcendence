from ..models import User, Friendship
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import FriendSerializer
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q


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
        target = User.objects.get(id=user_id)

        if target == request.user:
            return Response({"error": "You can't add yourself"}, status=400)

        # déjà existant ?
        if Friendship.objects.filter(
            from_user=request.user,
            to_user=target
        ).exists():
            return Response({"error": "Request already sent"}, status=400)

        # inverse déjà existant ?
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

        return Response({"message": "Friend request accepted"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deny_friend_request(request, request_id):
    try:
        friendship = Friendship.objects.get(
            Q(from_user=request.user) | Q(to_user=request.user),
            id=request_id,
            status="pending"
        )

        friendship.delete()

        return Response({"message": "Friend request refused"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete_friend_request(request, request_id):
    try:
        friendship = Friendship.objects.get(
            Q(from_user=request.user) | Q(to_user=request.user),
            id=request_id,
            status="accepted"
        )

        friendship.delete()

        return Response({"message": "Friend request delete"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)
    