from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from dj_rest_auth.registration.views import SocialLoginView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from game.models import Stat
from django.contrib.auth import get_user_model
from django.conf import settings
import logging
import requests

@api_view(["POST"])
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

	User = get_user_model()
	
	user, created = User.objects.get_or_create(email=data["email"], defaults={"username":data["login"]})
	if not created:
		return Response({f"error":"error creating account"}, status=400)
	Stat.objects.get_or_create(user=user)

	refresh = RefreshToken.for_user(user)
	access_token = refresh.access_token

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
		value=refresh,
		httponly=True,  ## Prevents javascript from accessing cookie
		secure=True, ## Only sends when request is https compliant ***Except on localhost
		samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
		path='/', ## Only sends to host that sent them and not any other host
		max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	)

	return res

@api_view(["POST"])
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
	
	User = get_user_model()
	
	user, created = User.objects.get_or_create(email=real_email, defaults={"username":data["login"]})
	# if not created:
	# 	return Response({f"error":"error creating account"}, status=400)
	Stat.objects.get_or_create(user=user)

	refresh = RefreshToken.for_user(user)
	access_token = refresh.access_token

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
		value=refresh,
		httponly=True,  ## Prevents javascript from accessing cookie
		secure=True, ## Only sends when request is https compliant ***Except on localhost
		samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
		path='/', ## Only sends to host that sent them and not any other host
		max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	)

	return res
	


class GoogleLogin(SocialLoginView):
	adapter_class = GoogleOAuth2Adapter
	callback_url = settings.GOOGLE_OAUTH_CALLBACK_URL
	client_class = OAuth2Client

	def get_response(self):
		response = super().get_response()

		Stat.objects.get_or_create(user=self.user)

		refresh = RefreshToken.for_user(self.user)

		response.set_cookie(
            key="access_token",
            value=str(refresh.access_token),
            httponly=True,
            secure=True,
            samesite="None",
            path="/",
            max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
        )

		response.set_cookie(
            key="refresh_token",
            value=str(refresh),
            httponly=False,
            secure=True,
            samesite="None",
            path="/",
            max_age=settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"],
        )

		response.delete_cookie(key="access")
		response.delete_cookie(key="refresh")

		return response

	
# class GoogleLogout():
#     def get(self, request, *args, **kwargs):
#         logout(request)
#         return HttpResponse('200')