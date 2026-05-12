from django.shortcuts import get_object_or_404
from ..models import User
from game.models import Stat
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import UserSerializer, FriendProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone

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
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_password(request):
    password = request.data.get("password")
    
    if not password:
        return Response(
            {"error": "Password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(
        username=request.user.username,
        password=password
    )

    return Response({
        "valid": user is not None
    })