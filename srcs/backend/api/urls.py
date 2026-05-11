from django.urls import path
from .views import register, login, user, get_friends, room_data, game_history, accept_friend_request, delete_friend_request, send_friend_request, leaderboard, deny_friend_request, user_data

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
    path("friends/delete/<int:request_id>/", delete_friend_request),
    #stat part
    path("leaderboard/", leaderboard),
    path("history/", game_history),
    path("room/<str:uuid>/", room_data),
    path("user/stats/<int:user_id>/", get_stat)
]