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
        return Response(RoomSerializer(room).data, status=201)

