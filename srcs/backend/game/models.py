from django.db import models
from api.models import User

# Create your models here.

class Room(models.Model):
    code = models.CharField(max_length=8, unique=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_rooms')
    created_at = models.DateTimeField(auto_now_add=True)
    is_started = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.code}"

class PlayerScore(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='scores')
    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ['player', 'room']
        
class PlayerPresence(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='presences')

    is_online = models.BooleanField(default=False)
    is_in_game = models.BooleanField(default=False)

    last_seen = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['player', 'room']