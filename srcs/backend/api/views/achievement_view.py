from ..models import User, Achievement, UserAchievement
from game.models import Stat, PlayerScore, Room, Stat, PlayerPresence
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from game.serializers import StatSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from api.auth.authentication import OptionalJWTAuthentication
from django.db.models import Q
from rest_framework.decorators import authentication_classes
from django.db.models import Count
from ..achievements.registry import get_condition_value

@api_view(["GET"])
@permission_classes([AllowAny])
def achievements(request):
    total_users = User.objects.filter(is_bot=False).count()

    unlock_counts = {
        row["achievement"]: row["count"]
        for row in (
            UserAchievement.objects.filter(user__is_bot=False)
            .values("achievement")
            .annotate(count=Count("user"))
        )
    }
    if request.user.is_authenticated:
        my_achievement_ids = set(
            UserAchievement.objects.filter(user=request.user)
            .values_list("achievement_id", flat=True)
        )
    else:
        my_achievement_ids = set()

    achievements = Achievement.objects.all()
    list_achievement = []
    
    for achievement in achievements:
        unlocked = unlock_counts.get(achievement.id, 0)

        rate = (
            round(unlocked * 100 / total_users, 1)
            if total_users > 0 else 0
        )
        condition = achievement.condition

        if request.user.is_authenticated:
            current_value = get_condition_value(request.user, condition)
        else:
            current_value = 0
        
        max_value = condition.get("value", 1)
        
        list_achievement.append({
		    "img": achievement.icon,
            "title": achievement.title,
            "description": achievement.description,
            "value": current_value,
            "max_value": max_value,
            "is_unlock": achievement.id in my_achievement_ids,
            "rate": rate
		})
    
    

    return Response(list_achievement)


