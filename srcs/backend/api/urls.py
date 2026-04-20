from django.urls import path
from .views import update_user, register, login

urlpatterns = [
	path("users/<int:id>/", update_user),
    path("register/", register),
    path("login/", login),
]