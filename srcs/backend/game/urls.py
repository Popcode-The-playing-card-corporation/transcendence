from django.urls import path
from .views.room_views import create_room, update_params, get_game_scorelog, list_room, add_bot, list_my_started_room, is_presence


urlpatterns = [
    path('rooms/list/', list_room),
    path('rooms/my/', list_my_started_room),
    
    path('room/', create_room, name='create-room'),
    path('room/<str:code>/add_bot/<int:nb_bot>/', add_bot, name='add-bot'),
    path('room/presence/', is_presence), ### Let's figure out what this is XD
    path('room/<str:code>/score/', get_game_scorelog),
    path('room/params/<str:code>/', update_params),
]