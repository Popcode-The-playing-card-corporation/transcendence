from rest_framework import serializers
from .models import User, Friendship

class UserSerializer(serializers.ModelSerializer):

    date_joined = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M"
    )

    last_login = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        allow_null=True
    )

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
            "elo",
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
    date_joined = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M"
    )
    
    last_login = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        allow_null=True
    )

    class Meta:
        model = User
        fields = [
            "username",
            "avatar",
            "date_joined",
            "is_online",
            "last_login",
            "elo",
        ]
 
class FriendSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    can_accept = serializers.SerializerMethodField()

    status = serializers.CharField()

    accepted_at = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M"
    )

    class Meta:
        model = Friendship
        fields = [
            "id",
            "user",
            "status",
            "accepted_at",
            "can_accept"
        ]

    def get_user(self, obj):
        request = self.context["request"]

        if obj.from_user == request.user:
            friend = obj.to_user
        else:
            friend = obj.from_user

        return {
            "id": friend.id,
            "username": friend.username,
            "is_online": friend.is_online
        }

    def get_can_accept(self, obj):
        request = self.context["request"]

        return (
            obj.status == "pending"
            and obj.to_user == request.user
        )