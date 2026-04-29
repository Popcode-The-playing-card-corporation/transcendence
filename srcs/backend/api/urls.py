from django.urls import path
from .views import register, login, user, get_friends, accept_friend_request, send_friend_request, deny_friend_request, user_data

urlpatterns = [
    #user part
    path("login/", login),
    path("register/", register),
    path("user/", user),
    path("user/<int:user_id>/", user_data),
    #friend part
    path("friends/", get_friends),
    path("friends/add/<int:user_id>/", send_friend_request),
    path("friends/accept/<int:request_id>/", accept_friend_request),
    path("friends/deny/<int:request_id>/", deny_friend_request),
]