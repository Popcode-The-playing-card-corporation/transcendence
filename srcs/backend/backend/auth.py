from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from django.conf import settings

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def VerifyCookie(request):
	return Response({"valid":True})

@api_view(["POST"])
@permission_classes([AllowAny])
def RefreshCookie(request):
	refresh = request.COOKIES.get("refresh_token")

	if refresh is None:
		return Response({"error": "Refresh token missing"}, status=401)
	
	serializer = TokenRefreshSerializer(data={"refresh": refresh})
	serializer.is_valid(raise_exception=True)

	access = serializer.validated_data['access']

	res = Response()
	res.data = {'succes': True}
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