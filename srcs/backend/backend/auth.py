from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from api.auth.authentication import OptionalJWTAuthentication
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework.decorators import authentication_classes
from django.conf import settings

@api_view(["POST"])
@permission_classes([AllowAny])
@authentication_classes([OptionalJWTAuthentication])
def VerifyCookie(request):

	if request.user.is_authenticated:
		return Response({"status":"success", "id":request.user.id, "has_pass":request.user.has_password})
	return RefreshCookie(request)

@permission_classes([AllowAny])
@authentication_classes([OptionalJWTAuthentication])
def RefreshCookie(request):


	refresh = request.COOKIES.get("refresh_token")

	if refresh is None:
		return Response({"status":"failed"})
	
	serializer = TokenRefreshSerializer(data={"refresh": refresh})
	try: 
		serializer.is_valid(raise_exception=True)
	except Exception:
		return Response({"status": "failed"})
	access = serializer.validated_data['access']
	user_id = AccessToken(access)["user_id"]

	res = Response()
	res.data = {'status': "success",  "id":user_id}
	res.set_cookie(
		key='access_token',
		value=access,
		httponly=True,  ## Prevents javascript from accessing cookie
		secure=True, ## Only sends when request is https compliant ***Except on localhost
		samesite='None', ## Cookie cannot be sent with crosssite requests (maybe in prod we should switch to secure or lax)
		path='/', ## Only sends to host that sent them and not any other host
		max_age=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"]  #sets expiry for token, required otherwise token is just kept for session
	)
	
	return res