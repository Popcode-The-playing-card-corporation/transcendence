from ..db import add_player_to_room
from ..models import PlayerPresence, Room
from api.models import Friendship, User
from asgiref.sync import sync_to_async
from django.db.models import Q, F

from .room_service import RoomService
from .room_task_service import RoomTaskService

class RoomConnectionService:

    @staticmethod
    async def handle_connect(user, code, channel_name):

        old_presence = await sync_to_async(
            lambda: User.objects.get(id=user.id).presence_game)()
        
        await sync_to_async(
            User.objects.filter(id=user.id).update
		)(presence_game=F("presence_game") + 1)
        
        if (old_presence != 0):
            return {"close": True, "code": 42}
 
        room = await sync_to_async(Room.objects.filter(code=code).first)()

        if not room:
            return {"close": True, "code": 4001}

        if not user or not user.is_authenticated:
            return {"close": True, "code": 4001}
        
        if room.status == "open":
            await RoomTaskService.schedule_lobby_kick_all(
                room.code
            )
        
        await RoomTaskService.cancel_delete(room.code)

        is_member = await sync_to_async(
            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).exists
        )()
        
        if room.status == "start":
            if is_member:
                return {"close": False}
            else:
                return {
                    "close": True,
                    "code": 4003,
                    "message": {"event": "game_event", "message": "room already started"}
                }

        if room.status == "open":
            if is_member:
                return {"close": False}

        if room.nb_player == room.max_player:
            return {
                "close": True,
                "code": 4003,
                "message": {"event": "game_event", "message": "room full"}
            }

        if room.status == "end":
            return {
                "close": True,
                "code": 4003,
                "message": {"event": "game_ended", "message": "ended"}
            }

        if room.status == "start" and not is_member:
            return {
                "close": True,
                "code": 4003,
                "message": {"event": "game_started", "message": "already started"}
            }

        presence = await sync_to_async(
        PlayerPresence.objects.select_related("room").filter(
                player=user,
                room__status="start"
            ).first
        )()

        if presence:
            return {
                "close": True,
                "code": 4003,
                "message": {
                    "type": "error",
                    "message": "You are already playing in another room"
                }
            }

        return await RoomConnectionService.check_blocking(user, room)

    @staticmethod
    async def check_blocking(user, room):

        participant_users = await sync_to_async(list)(
            PlayerPresence.objects.filter(room=room).values_list("player", flat=True)
        )

        blocking = await sync_to_async(
            Friendship.objects.filter(
                Q(from_user=user) | Q(to_user=user),
                status="blocked",
                blocked_by__in=participant_users,
            ).first
        )()

        if blocking:
            return {
                "close": True,
                "code": 4008
            }

        blocked = await RoomConnectionService.check_blocked_by_user(
            user,
            room,
            participant_users
        )

        if blocked:
            return {
                "close": True,
                "code": 4008,
                "message": {
                    "type": "settings_event",
                    "event": "blocked_users_present",
                    "message": "You cannot join this room",
                }
            }

        return {"close": False}

    @staticmethod
    async def check_blocked_by_user(user, room, participant_users):
    
        blocked_friendships = await sync_to_async(list)(
            Friendship.objects.filter(
                Q(from_user__in=participant_users) |
                Q(to_user__in=participant_users),
                status="blocked",
                blocked_by=user,
            ).select_related("from_user", "to_user")
        )
    
        if not blocked_friendships:
            return False
    
        blocked_users = []
    
        for f in blocked_friendships:
    
            blocked_user = (
                f.to_user
                if f.from_user == user
                else f.from_user
            )
    
            is_present = await sync_to_async(
                PlayerPresence.objects.filter(
                    player=blocked_user,
                    room=room
                ).exists
            )()
    
            if is_present:
                blocked_users.append(blocked_user.username)
    
        if not blocked_users:
            return False
    
        return {
            "close": True,
            "code": 4008,
            "message": {
                "type": "settings_event",
                "event": "blocked_users_present",
                "payload": {
                    "blocked_users": blocked_users,
                    "by": user.username
                }
            }
        }

    @staticmethod
    async def finalize_join(user, code, channel_name):

        room = await sync_to_async(Room.objects.get)(code=code)

        if room:
            await RoomTaskService.cancel_delete(room.code)
            
        await add_player_to_room(user, code)

        await sync_to_async(
            PlayerPresence.objects.filter(
                player=user,
                room=room
            ).update
        )(channel_name=channel_name)
        
        await RoomTaskService.cancel_play_for_player(room.code, user.id)

        
        
        