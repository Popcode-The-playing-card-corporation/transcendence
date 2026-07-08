from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from api.auth.authentication import OptionalJWTAuthentication
from ..models import Room, PlayerPresence
from api.models import User

@api_view(["POST"])
@authentication_classes([OptionalJWTAuthentication])
@permission_classes([IsAuthenticated])
def exit_game(request, code):
    if not Room.objects.filter(code=code).exists():
        return Response({"success": False}, status=404)
        
    room = Room.objects.select_related("host").filter(code=code).first()

    if not PlayerPresence.objects.filter(player_id=request.user.id, room=room).exists():
        return Response({"success": False}, status=404)
    p = PlayerPresence.objects.get(player_id=request.user.id, room=room)
    bots = list(User.objects.filter(is_bot=True))
    bots_room = list((PlayerPresence.objects.filter(is_human=False, room=room)).select_related("player"))
    valid_bots = []
    remove_bots = []
    for bot in bots:
        for bot_room in bots_room:
            if bot.id == bot_room.player_id:
                remove_bots.append(bot)
    for bot in bots:
        if (bot not in remove_bots):
            valid_bots.append(bot)
            
    nb_bots = PlayerPresence.objects.filter(
        room=room,
        is_human=False
    ).count()
    if room.nb_player - nb_bots == 1:
        room = Room.objects.get(code=code)
        room.delete()
        return Response({"success": True}, status=200)
    p.player = valid_bots[0]
    p.channel_name = None
    p.is_human = False
    
    p.save()
    
    return Response({"success": True}, status=200)