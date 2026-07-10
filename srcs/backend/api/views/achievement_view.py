from ..models import User, Achievement, UserAchievement
from game.models import Stat, PlayerScore, Room, Stat, PlayerPresence
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from game.serializers import StatSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from api.auth.authentication import OptionalJWTAuthentication
from django.db.models import Q
from rest_framework.decorators import authentication_classes

@api_view(["GET"])
@permission_classes([AllowAny])
@authentication_classes([OptionalJWTAuthentication])
def achievements(request):

    my_achievement_ids = set(
        UserAchievement.objects.filter(user=request.user)
        .values_list("achievement_id", flat=True)
    )

    achievements = Achievement.objects.all()
    list_achievement = []
    
    for achievement in achievements:
        list_achievement.append({
		    "img": achievement.icon,
            "title": achievement.title,
            "description": achievement.description,
            "value": 1,
            "max_value": 2,
            "is_unlock": achievement.id in my_achievement_ids,
            "rate": 5
		})
    
    

    return Response(list_achievement)


