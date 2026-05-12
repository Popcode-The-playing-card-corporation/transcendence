from django.urls import path
from .views.room_views import CreateRoomView, AddBotView


urlpatterns = [
    path('rooms/', CreateRoomView.as_view(), name='create-room'),
    path('rooms/<str:code>/add_bot/', AddBotView.as_view(), name='add-bot'),
]