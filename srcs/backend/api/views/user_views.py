from ..models import User, Friendship
from django.conf import settings
from game.models import Stat
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from rest_framework.response import Response
from ..serializers import UserSerializer, FriendProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.utils import timezone
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.db.models import Q
import random
from ..achievements.service import AchievementService

@api_view(["GET", "PUT", "PATCH"])
@permission_classes([IsAuthenticated])
def user(request):
    if request.method == "GET":
        serializer = UserSerializer(request.user)
        return Response(serializer.data)
    
    if request.method == "PUT" or request.method == "PATCH":
        if "username" in request.data:
            if request.user.has_password == True: ## I moved around the conditions to allow OAuth to change username for now
                if "password" in request.data:
                    user = authenticate(username=request.user.username, password=request.data["password"])
                    if user is None:
                        return Response(
							{"error": "Invalid credentials"},
							status=400
						)
                else:
                     return Response(
						{"error": "Missing information"},
						status=400
					)

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
        if Friendship.objects.filter(
            Q(from_user=request.user, to_user=user) |
            Q(from_user=user, to_user=request.user),
            status="blocked"
		).exists():
            return Response({
                "error": "Display not possible"
			}, status=403)
    except User.DoesNotExist:
        return Response(
            {
                "code": "user_not_found",
                "error": f"No user found with id {user_id}"
            },
            status=404
        )

    serializer = FriendProfileSerializer(
        user,
        context={"request": request}
    )

    return Response(serializer.data)
    
@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([AllowAny])
def register(request):
    username = request.data.get("username")
    re_pass = request.data.get("re_password")
    password = request.data.get("password")
    
    if (User.objects.filter(username=username).exists()):
        return Response(
            {"error": "This username is already used"},
            status=403
        )

    if (re_pass != password):
        return Response(
			{"error": (f"Passwords must match!")},
			status=400
		)
    
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
            if random.randint(1, 100) == 42:
                user.clovers += 1
            user.save(update_fields=["last_login", "clovers"])
            AchievementService.check_user_achievements(user)
    
            refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        refresh_token = refresh
        
        res = Response()
        res.data = {'success': True,  "id":user.id, "has_pass":user.has_password}
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
@permission_classes([IsAuthenticated])
def logout(request):
	res = Response()
	res.data = {'success': True}
    
	res.delete_cookie(key="access_token")
	res.delete_cookie(key="refresh_token")
    
	return res
    
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def delete(request):
    if request.user.presence_game != 0:
        return Response(
			{"success": False,
			"message": "Cannot delete account while in a game"},
			status=400
		)
    request.user.delete()
    res = Response({"success": True})
    res.delete_cookie("access_token")
    res.delete_cookie("refresh_token")
    return res

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([AllowAny])
def login(request):
    username = request.data.get("username")
    password = request.data.get("password")

    if password == "":
        return Response(
            {"error": "Password empty"},
            status=401
        )
    user = authenticate(username=username, password=password)

    if user is not None:
        user.last_login = timezone.now()
        if random.randint(1, 100) == 42:
            user.clovers += 1
        user.save(update_fields=["last_login", "clovers"])
        AchievementService.check_user_achievements(user)

        refresh = RefreshToken.for_user(user)
        access_token = refresh.access_token
        refresh_token = refresh
        
        res = Response()
        res.data = {'success': True, "id":user.id, "has_pass":user.has_password}
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

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def change_password(request):
    old_password = request.data.get("old_password")
    new_password = request.data.get("new_password")
    new_password2 = request.data.get("new_password2")
    
    
    if request.user.has_password != True:
        return Response(
            {"error": "Invalid account type"},
            status=400
		)
    
    if not old_password:
        return Response(
            {"error": "Old password required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if check_password(old_password, request.user.password):
        if not new_password:
            return Response(
                {"error": "Password required"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        if not new_password2:
            return Response(
                {"error": "Password2 required"},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    
        if new_password == new_password2:
            try:
                user = User.objects.get(id=user.id)
                validate_password(new_password, user)
                user.set_password(new_password)
                user.save()
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
    else:
        return Response(
            {"error": "Old password incorrect"},
            status=status.HTTP_400_BAD_REQUEST
        )