from django.shortcuts import get_object_or_404
from .models import User, Friendship
from game.models import Stat, PlayerScore
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import UserSerializer, FriendSerializer, FriendProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.db.models import Q

@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def user(request):
    if request.method == "GET":
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    if request.method == "PUT" or request.method == "PATCH":
        serializer = UserSerializer(request.user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def user_data(request, user_id):
    user = User.objects.get(id=user_id)
    serializer = FriendProfileSerializer(user)
    return Response(serializer.data)
    

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        Stat.objects.create(user=user)
        
        username = user.username
        password = request.data.get("password")
        
        user = authenticate(username=username, password=password)
        if user is not None:
            user.last_login = timezone.now()
            user.save(update_fields=["last_login"])
    
            refresh = RefreshToken.for_user(user)
    
            return Response({
                "access": str(refresh.access_token),
                "refresh": str(refresh),
            })
        
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user is not None:
        user.last_login = timezone.now()
        user.save(update_fields=["last_login"])

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
        })

    return Response(
        {"error": "Invalid credentials"},
        status=401
    )
    

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
        friendship.save()

        return Response({"message": "Friend request accepted"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def deny_friend_request(request, request_id):
    try:
        friendship = Friendship.objects.get(
            id=request_id,
            to_user=request.user,
            status="pending"
        )

        friendship.delete()

        return Response({"message": "Friend request refused"})

    except Friendship.DoesNotExist:
        return Response({"error": "Request not found"}, status=404)
    
    
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def leaderboard(request):
    top = list(
        User.objects
        .order_by("-elo")
        .values("id", "username", "elo")[:15]
    )

    user = request.user

    rank = User.objects.filter(elo__gt=user.elo).count() + 1

    me = {
        "id": user.id,
        "username": user.username,
        "elo": user.elo,
        "rank": rank
    }

    return Response({
        "leaderboard": top,
        "user_rank": me
    })
