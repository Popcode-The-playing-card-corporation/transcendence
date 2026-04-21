from django.urls import path
from .views.room_views import CreateRoomView, JoinRoomView


urlpatterns = [
    path('rooms/', CreateRoomView.as_view(), name='create-room'),
    path('rooms/<str:code>/join/', JoinRoomView.as_view(), name='join-room'),
]