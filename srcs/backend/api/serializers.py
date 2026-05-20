from rest_framework import serializers
from .models import User, Friendship
from django.db.models import Q

class AuthSerializer(serializers.Serializer):
    code = serializers.CharField(required=False)
    error = serializers.CharField(required=False)

class UserSerializer(serializers.ModelSerializer):

    date_joined = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        read_only=True
    )
    
    last_login = serializers.DateTimeField(
        format="%d/%m/%Y %H:%M",
        allow_null=True,
        read_only=True
    )

    class Meta:
        model = User
        fields = [
            "id",
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
    
    is_friend = serializers.SerializerMethodField()
    is_blocked = serializers.SerializerMethodField()
    blocked_by_me = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "avatar",
            "date_joined",
            "is_online",
            "last_login",
            "elo",
            "is_friend",
            "is_blocked",
            "blocked_by_me",
        ]
    
    def get_is_friend(self, obj):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        user = request.user

        return Friendship.objects.filter(
            status="accepted"
        ).filter(
            Q(from_user=user, to_user=obj) |
            Q(from_user=obj, to_user=user)
        ).exists()
    
    def get_is_blocked(self, obj):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        user = request.user

        return Friendship.objects.filter(
            status="blocked"
        ).filter(
            Q(from_user=user, to_user=obj) |
            Q(from_user=obj, to_user=user)
        ).exists()
        
    def get_blocked_by_me(self, obj):
    
        request = self.context.get("request")
    
        if not request or not request.user.is_authenticated:
            return None
    
        user = request.user
    
        friendship = Friendship.objects.filter(
            status="blocked"
        ).filter(
            Q(from_user=user, to_user=obj) |
            Q(from_user=obj, to_user=user)
        ).first()
    
        if not friendship:
            return None
    
        if friendship.blocked_by.id == user.id:
            return True
        elif friendship.blocked_by.id == obj.id:
            return False
 
class FriendSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    can_accept = serializers.SerializerMethodField()

    status = serializers.CharField()

    accepted_at = serializers.DateField(
        format="%d/%m/%Y"
    )
    created_at = serializers.DateField(
        format="%d/%m/%Y"
    )
    blocked_at = serializers.DateField(
        format="%d/%m/%Y",
        allow_null=True
    )
    blocked_by = serializers.PrimaryKeyRelatedField(
        read_only=True, 
        allow_null=True
    )


    class Meta:
        model = Friendship
        fields = [
            "id",
            "user",
            "status",
            "accepted_at",
            "created_at",
            "can_accept",
            "blocked_by",
            "blocked_at"
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