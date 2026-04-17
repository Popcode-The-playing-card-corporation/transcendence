from django.urls import path
from .views import list_users, update_user, get_user

urlpatterns = [
    path("users/", list_users),
	path("users/<int:id>/", update_user),
	path("users/<int:id>/details", get_user),
]