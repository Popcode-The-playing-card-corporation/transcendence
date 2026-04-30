from rest_framework import serializers
from .models import User, Friendship

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "password",
            "avatar",
            "date_joined",
            "is_online",
            "last_login",
        ]
        extra_kwargs = {
            "password": {"write_only": True}
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance

class FriendProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "avatar",
            "date_joined",
            "is_online",
            "last_login",
        ]
 
class FriendSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    status = serializers.CharField()

    class Meta:
        model = Friendship
        fields = ["id", "user", "status"]

    def get_user(self, obj):
        request = self.context["request"]

        # trouver "l'autre" user
        if obj.from_user == request.user:
            friend = obj.to_user
        else:
            friend = obj.from_user

        return {
            "id": friend.id,
            "username": friend.username,
            "is_online": friend.is_online
        }