from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async
from http.cookies import SimpleCookie

User = get_user_model()

class JwtAuthMiddleware:
	def __init__(self, app):
		self.app = app

	async def __call__(self, scope, receive, send):

		headers = dict(scope["headers"])

		token = None
		if b"cookie" in headers:
			cookies = SimpleCookie(headers[b"cookie"].decode())

			if "access_token" in cookies:
				token = cookies["access_token"].value

		scope["user"] = AnonymousUser()

		if token:
			try:
				access_token = AccessToken(token)
				user_id = access_token["user_id"]

				user = await sync_to_async(User.objects.get)(id=user_id)

				scope["user"] = user

			except Exception as e:
				print("AUTH ERROR:", e)

		return await self.app(scope, receive, send)