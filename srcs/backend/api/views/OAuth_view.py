from django.shortcuts import redirect
from django.conf import settings
from django.contrib.auth import login
from rest_framework.views import APIView
from ..models import User
from ..serializers import AuthSerializer
from ..services import get_user_data
from django.contrib.auth import logout
from django.http import HttpResponse


class GoogleLogin(APIView):
	def get(self, request, *arg, **kwargs):
		auth = AuthSerializer(data=request.GET)
		auth.is_valid(raise_exception=True)

		validated_data = auth.validated_data
		user_data = get_user_data(validated_data)

		user = User.objects.get(email=user_data['email'])
		login(request, user)

		return redirect(settings.BASE_APP_URL)
	
class GoogleLogout(APIView):
    def get(self, request, *args, **kwargs):
        logout(request)
        return HttpResponse('200')