from rest_framework import serializers
from .models import Room, PlayerScore
from api.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'code', 'host', 'created_at']


class PlayerScoreSerializer(serializers.ModelSerializer):
    player = UserSerializer()

    class Meta:
        model = PlayerScore
        fields = ['player', 'score']