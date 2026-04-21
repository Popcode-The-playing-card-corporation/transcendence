from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Room, PlayerScore
from ..serializers import RoomSerializer
import uuid

class CreateRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        room_code = str(uuid.uuid4())[:8]
        room = Room.objects.create(
            code=room_code,
            host=request.user
        )
        PlayerScore.objects.create(player=request.user, room=room)  # Add host to leaderboard
        return Response(RoomSerializer(room).data, status=201)

class JoinRoomView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, code):
        try:
            room = Room.objects.get(code=code)
            PlayerScore.objects.get_or_create(player=request.user, room=room)
            return Response({"message": f"Joined room"}, status=200)
        except Room.DoesNotExist:
            return Response({"error": "Room not found"}, status=404)