from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Room, PlayerScore, PlayerPresence
from api.models import User
from ..serializers import RoomSerializer
from db import add_player_to_room
import uuid

class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_code = str(uuid.uuid4())[:8]
        room = Room.objects.create(
            code=room_code,
            host=request.user
        )
        return Response(RoomSerializer(room).data, status=201)

class AddBotView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, code):
        room = Room.objects.get(
            code=code
        )
        if (room.host == request.user):
            user = User.objects.get(username="BOT")
            add_player_to_room(user, code)
