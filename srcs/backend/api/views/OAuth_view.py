from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from rest_framework.response import Response
from game.models import Stat
from django.utils import timezone
from ..models import User
from django.conf import settings
import requests
import random

def OAUTH_Success(user, message):
	
	refresh = RefreshToken.for_user(user)
	access_token = refresh.access_token

	res = Response()
	res.data = {'success': True, 'message': message, "id": user.id, "has_pass":user.has_password}
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
		value=refresh,
		httponly=True,  ## Prevents javascript from accessing cookie
		secure=True, ## Only sends when request is https compliant ***Except on localhost
		samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
		path='/', ## Only sends to host that sent them and not any other host
		max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	)

	return res

def check_username(User, new_username, api):
	if (api == 'google'):
		new_username = new_username.split('@')[0]
	i = ""
	tmp_user = new_username
	while (User.objects.filter(username=(tmp_user + str(i)))):
		if not i:
			i = 1
		new_username = new_username + str(i)
		i += 1
	new_username = new_username.strip()
	return new_username


def handle_db(new_email, API, id=0, new_username=""):
	if (API == 'google'):
		new_username = new_email
	if (User.objects.filter(email=new_email).exists()):

		user = User.objects.get(email=new_email)
		user.last_login = timezone.now()
		user.has_password = False
		if random.randint(1, 100) == 42:
			user.clovers += 1
		if (API == "google"):
			user.google_id = id
			user.save(update_fields=["google_id", "last_login", "has_password", "clovers"])
		if (API == "github"):
			user.github_id = id
			user.save(update_fields=["github_id", "last_login", "has_password", "clovers"])
		if (API == "fortytwo"):
			user.fortytwo_id = id
			user.save(update_fields=["fortytwo_id", "last_login", "has_password", "clovers"])
		return (OAUTH_Success(user, "Merged accounts with email"))
	
	message = "Success"
	check_name = new_username
	new_username = check_username(User, new_username, API)
	if (check_name != new_username):
		message = "Username changed"
	user = User.objects.create(email=new_email, username=new_username)
	Stat.objects.create(user=user)
	user.last_login = timezone.now()
	user.date_joined = timezone.now()
	user.avatar = "/avatars/avatar1.png"
	if random.randint(1, 100) == 42:
		user.clovers += 1
	user.has_password = False
	if (API == "google"):
		user.google_id = id
		user.save(update_fields=["google_id", "last_login", "has_password", 'date_joined', "avatar"])
	if (API == "github"):
		user.github_id = id
		user.save(update_fields=["github_id", "last_login", "has_password", 'date_joined', "avatar"])
	if (API == "fortytwo"):
		user.fortytwo_id = id
		user.save(update_fields=["fortytwo_id", "last_login", "has_password", 'date_joined', "avatar"])
	return (OAUTH_Success(user, message))


@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([AllowAny])
def FortyTwoLogin(request):
	code = request.data.get("code")
	if not code:
		return Response({"error":"no code given"}, status=400)
	token_req = requests.post("https://api.intra.42.fr/oauth/token",
					   data={
						   "grant_type":"authorization_code",
						   "client_id":settings.FORTYTWO_OAUTH_CLIENT_ID,
						   "client_secret":settings.FORTYTWO_OAUTH_CLIENT_SECRET,
						   "code":code,
						   "redirect_uri":settings.FORTYTWO_OAUTH_CALLBACK_URL,
					   })
	if (token_req.status_code != 200):
		return(Response({f"error":"error getting token"}, status=400))
	
	token = token_req.json()["access_token"]

	user_data = requests.get("https://api.intra.42.fr/v2/me", headers={"Authorization": f"Bearer {token}"})
	if (user_data.status_code != 200):
		return(Response({f"error":"error getting user data"}, status=400))
	
	data = user_data.json()

	return (handle_db(data["email"], "fortytwo", id=data['id'], new_username=data["login"]))


@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([AllowAny])
def GitLogin(request):
	code = request.data.get("code")
	if not code:
		return Response({"error":"no code given"}, status=400)
	token_req = requests.post("https://github.com/login/oauth/access_token",
					   headers={
						   "Accept":"application/json"
					   },
					   data={
						   "client_id":settings.GIT_OAUTH_CLIENT_ID,
						   "client_secret":settings.GIT_OAUTH_CLIENT_SECRET,
						   "code":code,
						   "redirect_uri":settings.GIT_OAUTH_CALLBACK_URL,
					   })
	if (token_req.status_code != 200):
		return(Response({f"error":"error getting token"}, status=400))
	
	token = token_req.json()["access_token"]

	emails = requests.get("https://api.github.com/user/emails", headers={"Authorization": f"Bearer {token}","Accept": "application/json"})
	user_data = requests.get("https://api.github.com/user", headers={"Authorization": f"Bearer {token}"})
	if (user_data.status_code != 200):
		return(Response({f"error":"error getting user data"}, status=400))
	emails = emails.json()
	real_email = None
	for email in emails:
		if email.get("primary") and email.get('verified'):
			real_email = email.get('email')
			break
	
	if (real_email is None):
		return(Response({f"error":"error email is inaccessible"}, status=400))

	data = user_data.json()

	return (handle_db(real_email, "github", id=data['id'], new_username=data["login"]))


@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([AllowAny])
def GoogleLogin(request):
	code = request.data.get("code")
	if not code:
		return Response({"error":"no code given"}, status=400)
	token_req = requests.post("https://oauth2.googleapis.com/token",
					   data={
						   "client_id":settings.GOOGLE_OAUTH_CLIENT_ID,
						   "client_secret":settings.GOOGLE_OAUTH_CLIENT_SECRET,
						   "code":code,
						   "redirect_uri":settings.GOOGLE_OAUTH_CALLBACK_URL,
						   "grant_type":"authorization_code"
					   })
	if (token_req.status_code != 200):
		return(Response({f"error":"error getting token"}, status=400))
	
	token = token_req.json()["access_token"]

	user_data = requests.get("https://www.googleapis.com/oauth2/v3/userinfo", headers={"Authorization": f"Bearer {token}"})
	if (user_data.status_code != 200):
		return(Response({f"error":"error getting user data"}, status=400))

	data = user_data.json()

	return (handle_db(data['email'], "google", id=data['sub']))
