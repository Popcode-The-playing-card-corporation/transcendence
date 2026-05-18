from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from ..models import Room
from ..models import PlayerPresence
from api.models import User
from ..serializers import RoomSerializer
from ..db import add_bot_to_room
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
        if (room.nb_player == 7):
            return Response(
                {"message": "too many player in that room"},
                status= 401
            )

        if (room.host == request.user):
            last_bot = PlayerPresence.objects.filter(is_human=False, room=room).last()

            if (not last_bot):
                user = User.objects.get(username="BOT0")
            else:
                user = User.objects.get(id= int(last_bot.id))
                
                result = user.username.removeprefix("BOT")
                nbr = int(result) + 1
                user = User.objects.get(username= f"BOT{nbr}")

            add_bot_to_room(user, code)
            room = Room.objects.get(
                code=code
            )
            ret = {}
            for i in range(room.nb_player):
                p =  PlayerPresence.objects.get(
                    room=room,
                    position= i
                )
                user = User.objects.get(id=p.player_id)
                ret[str(i)] = user.username

            return Response(ret, status=201)
        
        return Response(
            {"error": "You are not the host. BAD"},
            status=401
        )
