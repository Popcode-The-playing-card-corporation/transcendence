from django.urls import path
from .views.room_views import create_room, get_game_scorelog, list_room, add_bot, list_my_started_room, is_presence


urlpatterns = [
    path('rooms/', create_room, name='create-room'),
    path('rooms/list/', list_room),
    path('rooms/my/', list_my_started_room),
    
    path('room/<str:code>/add_bot/', add_bot, name='add-bot'),
    path('room/presence/', is_presence),
    path('room/<str:code>/score/', get_game_scorelog),
]