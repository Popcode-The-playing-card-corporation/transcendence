from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

class CookieAuth(JWTAuthentication):
	def authenticate(self, request):
		token = request.COOKIES.get("access_token")

		if token is None:
			return None
		
		try:
			valid = self.get_validated_token(token)
			return self.get_user(valid), valid
		
		except InvalidToken:
			return None