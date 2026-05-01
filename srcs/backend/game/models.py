from django.db import models
from api.models import User
import uuid

def default_state():
    return {
        "players": {},
        "lastCard": None,
        "playing": 0,
        "board": {}
    }

def tricks_state():
    return {
        "club": 0,
        "heart": 0,
        "spade": 0,
        "diamond": 0
    }

# Create your models here.

class Room(models.Model):
    STATUS_CHOICES = [
        ("open", "Open"),
        ("start", "Start"),
        ("end", "End"),
    ]
    
    uuid = models.UUIDField(default=uuid.uuid4, unique=True, editable=False)
    code = models.CharField(max_length=8, unique=True)
    host = models.ForeignKey(User, on_delete=models.CASCADE, related_name='hosted_rooms')
    status = models.CharField(max_length=5, choices=STATUS_CHOICES, default="open")
    game_state = models.JSONField(default=default_state)
    created_at = models.DateTimeField(auto_now_add=True)
    nb_player = models.IntegerField(default=0)
    
    def __str__(self):
        return f"{self.code}"

class PlayerScore(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    rank = models.IntegerField(null=True)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='scores')
    score = models.IntegerField(default=0)

    class Meta:
        unique_together = ['player', 'room']
        
class PlayerPresence(models.Model):
    player = models.ForeignKey(User, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='presences')

    is_online = models.BooleanField(default=False)
    is_human = models.BooleanField(default=True)
    position = models.IntegerField(default=0)
    last_seen = models.DateTimeField(auto_now=True)
    channel_name = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        unique_together = ['player', 'room']
        
class Stat(models.Model):
    TRICKS_CHOICES = [
        ("null", "Null"),
        ("club", "Club"),
        ("heart", "Heart"),
        ("spade", "Spade"),
        ("diamond", "Diamond"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    win = models.IntegerField(default=0)
    lose = models.IntegerField(default=0)
    played = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)
    nb_taken = models.IntegerField(default=0)
    nb_last_take = models.IntegerField(default=0)
    nb_trick_choose = models.IntegerField(default=0)
    prefered_trick = models.CharField(max_length=10, choices=TRICKS_CHOICES, default="null")
    tricks = models.JSONField(default=tricks_state)
    hand_meld_points = models.IntegerField(default=0)
    board_meld_points = models.IntegerField(default=0)
    highest_hand_meld = models.IntegerField(default=0)
    highest_board_meld = models.IntegerField(default=0)
    nb_host = models.IntegerField(default=0)
    
    