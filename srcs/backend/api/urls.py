from django.urls import path
from .views.user_views import register, change_password, login, logout, user, user_data, delete
from .views.friend_view import get_friends, unblock_friend, list_propal, accept_friend_request, list_user_not_friend, block_friend, list_blocked, delete_friend_request, send_friend_request
from .views.stat_view import get_stat, room_data, game_history, leaderboard, game_history_friend
from .views.OAuth_view import GoogleLogin, FortyTwoLogin, GitLogin
from .views.achievement_view import achievements

urlpatterns = [
    #user part
    path("login/", login),
    path("register/", register),
    path("user/", user),
    path("user/<int:user_id>/", user_data),
    path("user/pswd/", change_password),
	path("delete/", delete),

	path("logout/", logout),
	# #OAuth part
	path("login/google/", GoogleLogin, name="google_login"),
	path("login/42/", FortyTwoLogin, name="42_login"),
	path("login/github/", GitLogin, name="GitHub_login"),
    
    #friend part
    path("friends/", get_friends),
    path("friends/add/<int:user_id>/", send_friend_request),
    path("friends/accept/<int:request_id>/", accept_friend_request),
    path("friends/delete/<int:request_id>/", delete_friend_request),
    path("friends/block/<int:user_id>/", block_friend),
    path("friends/block/", list_blocked),
    path("friends/unblock/<int:request_id>/", unblock_friend),
    path("propal/", list_propal),
    path("list_not_friend/", list_user_not_friend),
    
    #stat part
    path("leaderboard/", leaderboard),
    path("history/", game_history),
    path("room/data/<str:code>/", room_data),
    path("user/<int:user_id>/stats/", get_stat),
    path("user/<int:user_id>/history/", game_history_friend),
    
    path("achievements/", achievements),
]