from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from ..models import Room, PlayerPresence, GameLog
from api.models import User, Friendship
from ..serializers import RoomSerializer
from django.db.models import Q
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from ..db import add_bot_to_room
import uuid

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def create_room(request):
    room_code = str(uuid.uuid4())[:8]
    room = Room.objects.create(
        code=room_code,
        host=request.user
    )
    
    friendships = list(
        Friendship.objects.filter(
            Q(from_user=request.user) |
            Q(to_user=request.user),
            status="accepted"
        ).select_related("from_user", "to_user")
    )
    channel_layer = get_channel_layer()
    for friendship in friendships:
        target = (
            friendship.to_user
            if friendship.from_user == request.user
            else friendship.from_user
        )

        if target.is_online:

            async_to_sync(channel_layer.group_send)(
                f"user_{target.id}",
                {
                    "type": "notify",
                    "event": "notification",
                    "type_notify": "game_created",
            
                    "payload": {
                        "code": room_code,
                        "from_user": request.user.username,
                        "from_user_id": request.user.id,
                        "message": f"{request.user.username} create a game"
                    }
                }
            )
    
    
    return Response(RoomSerializer(room).data, status=201)