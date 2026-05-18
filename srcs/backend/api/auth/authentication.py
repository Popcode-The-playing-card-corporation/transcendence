from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework import exceptions

class OptionalJWTAuthentication(JWTAuthentication):

    def authenticate(self, request):

        try:
            return super().authenticate(request)

        except InvalidToken:
            return None