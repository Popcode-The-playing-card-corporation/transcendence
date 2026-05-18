from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    email = models.EmailField(unique=True)

    #avatar = models.ImageField(upload_to="avatars/", blank=True, null=True)
    avatar = models.CharField(max_length=255, default="avatars/avatar.jpg")
    is_online = models.BooleanField(default=False)
    is_bot = models.BooleanField(default=False)
    elo = models.IntegerField(default=0)
    
class Friendship(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("accepted", "Accepted"),
        ("blocked", "Blocked"),
    ]

    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_friendships")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_friendships")

    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="pending")

    created_at = models.DateField(auto_now_add=True)
    accepted_at = models.DateField(null=True)
    blocked_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blocked_by", null=True)
    blocked_at = models.DateField(null=True)

    class Meta:
        unique_together = ("from_user", "to_user")
        
class Achievement(models.Model):

    code = models.CharField(
        max_length=50,
        unique=True
    )

    title = models.CharField(
        max_length=100
    )

    description = models.TextField()

    condition = models.TextField()

    icon = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )
    
    is_hidden = models.BooleanField(default=False)

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title


class UserAchievement(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="user_achievements"
    )

    achievement = models.ForeignKey(
        Achievement,
        on_delete=models.CASCADE,
        related_name="users"
    )

    unlocked_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        unique_together = ("user", "achievement")

    def __str__(self):
        return f"{self.user.username} - {self.achievement.title}"