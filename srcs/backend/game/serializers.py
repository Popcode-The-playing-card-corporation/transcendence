from rest_framework import serializers
from .models import Room, PlayerScore, Stat
from api.serializers import UserSerializer


class RoomSerializer(serializers.ModelSerializer):
    host = UserSerializer(read_only=True)

    class Meta:
        model = Room
        fields = ['id', 'code', 'host', 'created_at', 'status', 'max_player', 'type', 'nb_games', 'nb_points', 'goal']
        extra_kwargs = {
            "id": {"read_only": True},
            "code": {"read_only": True},
            "host": {"read_only": True},
            "created_at": {"read_only": True},
        }

    def update(self, instance, validated_data):
        
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
    
        instance.save()
        return instance

class PlayerScoreSerializer(serializers.ModelSerializer):
    player = UserSerializer()

    class Meta:
        model = PlayerScore
        fields = ['player', 'score']
        
class StatSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Stat
        fields = "__all__"
    