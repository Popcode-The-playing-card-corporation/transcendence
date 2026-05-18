from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from ..models import User
from django.conf import settings
from game.models import Stat
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from ..serializers import UserSerializer, FriendProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password

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

    serializer = FriendProfileSerializer(user)

    return Response(serializer.data)
    

@api_view(["POST"])
@permission_classes([AllowAny])
def register(request):
    password = request.data.get("password")
    try:
        validate_password(password)
        
    except ValidationError as e:
        for error in e.messages:
            return Response(
                {"error": (f"Password validation error: {error}")},
                status=400
            )
            
    serializer = UserSerializer(data=request.data)
    if not serializer.is_valid():

        errors = {}
    
        for field, messages in serializer.errors.items():
            errors[field] = messages[0]
    
        return Response(errors, status=400)
    if serializer.is_valid():
        user = serializer.save()
        Stat.objects.create(user=user)
        
        username = user.username

        user = authenticate(username=username, password=password)
        if user is not None:
            user.last_login = timezone.now()
            user.save(update_fields=["last_login"])
    
            refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        refresh_token = refresh
        
        res = Response()
        res.data = {'success': True}
        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  ## Prevents javascript from accessing cookie
            secure=True, ## Only sends when request is https compliant ***Except on localhost
            samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
            path='/', ## Only sends to host that sent them and not any other host
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	    )
        
        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,  ## Prevents javascript from accessing cookie
            secure=True, ## Only sends when request is https compliant ***Except on localhost
            samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
            path='/', ## Only sends to host that sent them and not any other host
            max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	    )
        
        return res
        
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
        access_token = refresh.access_token
        refresh_token = refresh
        
        res = Response()
        res.data = {'success': True}
        res.set_cookie(
            key='access_token',
            value=access_token,
            httponly=True,  ## Prevents javascript from accessing cookie
            secure=True, ## Only sends when request is https compliant ***Except on localhost
            samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
            path='/', ## Only sends to host that sent them and not any other host
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	    )
        
        res.set_cookie(
            key='refresh_token',
            value=refresh_token,
            httponly=True,  ## Prevents javascript from accessing cookie
            secure=True, ## Only sends when request is https compliant ***Except on localhost
            samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
            path='/', ## Only sends to host that sent them and not any other host *** maybe should be changed to just refresh path but in production tbc ...
            max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	    )
        
        return res

        # return Response({
        #     "access": str(refresh.access_token),
        #     "refresh": str(refresh),
        # })

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

    if check_password(password, request.user.password):
        return Response({
            "valid": True
        })
    else:
        return Response({
            "valid": False
        })
        
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def check_new_password(request):
    password = request.data.get("password")
    password2 = request.data.get("password2")
    
    if not password:
        return Response(
            {"error": "Password required"},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    if not password2:
        return Response(
            {"error": "Password2 required"},
            status=status.HTTP_400_BAD_REQUEST
        )


    if password == password2:
        try:
            validate_password(password, user)
            return Response(
                {"valid": True},
                status=200
            )
            
        except ValidationError as e:
            for error in e.messages:
                return Response(
                    {"error": (f"Password validation error: {error}")},
                    status=400
                )

    else:
        return Response(
            {"error": "Not the same password"},
            status=400
        )

        
