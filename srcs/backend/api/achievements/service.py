from django.utils import timezone

from api.models import Achievement, UserAchievement
from .checker import check

#TODO maybe send notification when a succes is validate ?
class AchievementService:

    @staticmethod
    def check_user_achievements(user, context=None):
        context = context or {}
        print("user : ", user)
        print("context : ", context)

        unlocked_ids = UserAchievement.objects.filter(
            user=user
        ).values_list("achievement_id", flat=True)

        achievements = Achievement.objects.exclude(
            id__in=unlocked_ids
        )

        unlocked = []

        for achievement in achievements:
            if check(user, achievement.condition, context):
                UserAchievement.objects.create(
                    user=user,
                    achievement=achievement,
                    unlocked_at=timezone.now()
                )

                unlocked.append(achievement)

        return unlocked