from django.urls import path
from .views.user_views import register, login, user, user_data, verify_password, check_new_password
from .views.friend_view import get_friends, list_user, accept_friend_request, block_friend, list_blocked, delete_friend_request, send_friend_request, deny_friend_request
from .views.stat_view import get_stat, room_data, game_history, leaderboard


urlpatterns = [
    #user part
    path("login/", login),
    path("register/", register),
    path("user/", user),
    path("user/<int:user_id>/", user_data),
    path("user/verify/", verify_password),
    path("user/check/", check_new_password),
    
    #friend part
    #TODO add search user to friend
    path("friends/", get_friends),
    path("friends/add/<int:user_id>/", send_friend_request),
    path("friends/accept/<int:request_id>/", accept_friend_request),
    path("friends/deny/<int:request_id>/", deny_friend_request),
    path("friends/delete/<int:request_id>/", delete_friend_request),
    path("friends/block/<int:request_id>/", block_friend),
    path("friends/block/", list_blocked),
    path("search/<str:name>/", list_user),
    
    #TODO add report
    
    #stat part
    path("leaderboard/", leaderboard),
    path("history/", game_history),
    path("room/<str:uuid>/", room_data),
    path("user/<int:user_id>/stats/", get_stat)
    #TODO add achivment models et table to connect to user
]