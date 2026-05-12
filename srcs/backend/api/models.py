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

    class Meta:
        unique_together = ("from_user", "to_user")