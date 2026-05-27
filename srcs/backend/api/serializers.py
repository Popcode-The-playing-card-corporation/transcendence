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
    password = None

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
            "has_password",
            "elo",
        ]

        extra_kwargs = {
            "password" : {"write_only": True},
            "id": {"read_only": True},
            "elo": {"read_only": True},
            "date_joined": {"read_only": True},
            "last_login": {"read_only": True},
            "email": {"read_only": True},
            "has_password": {"read_only": True},
            "is_online": {"read_only": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password")
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
    
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
    
    is_online = serializers.SerializerMethodField()
    last_login = serializers.SerializerMethodField()
    friend = serializers.SerializerMethodField()
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
            "friend",
            "blocked_by_me",
        ]
    
    def _get_friendship(self, obj, status=None):

        request = self.context.get("request")
    
        if not request or not request.user.is_authenticated:
            return None
    
        user = request.user
    
        query = Friendship.objects.filter(
            Q(from_user=user, to_user=obj) |
            Q(from_user=obj, to_user=user)
        )
    
        if status:
            query = query.filter(status=status)
    
        return query.first()
    
    def get_is_online(self, obj):
        request = self.context.get("request")
    
        if not request or not request.user.is_authenticated:
            return None
    
        is_friend = self._get_friendship(obj, "accepted")
        
        if not is_friend:
            return None
        
        return obj.is_online
    
    def get_last_login(self, obj):

        request = self.context.get("request")
    
        if not request or not request.user.is_authenticated:
            return None
    
        is_friend = self._get_friendship(obj, "accepted")
    
        if not is_friend:
            return None
    
        if not obj.last_login:
            return None
    
        return obj.last_login.strftime("%d/%m/%Y %H:%M")
    
    def get_friend(self, obj):

        request = self.context.get("request")

        if not request or not request.user.is_authenticated:
            return False

        friend = self._get_friendship(obj, "accepted")
        
        if not friend:
            friend = self._get_friendship(obj, "pending") ### I'm not sure if this is used elsewhere than in user_data, but hopefully nothing is broken
            if not friend:
                return None
    
        return {
            "id": friend.id,
            "status": friend.status,
            "created_at": friend.created_at,
        }
        
    def get_blocked_by_me(self, obj):
    
        request = self.context.get("request")
    
        if not request or not request.user.is_authenticated:
            return None
    
        user = request.user
    
        friendship = self._get_friendship(obj, "blocked")
    
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
            "avatar": friend.avatar,
            "is_online": friend.is_online
        }

    def get_can_accept(self, obj):
        request = self.context["request"]

        return (
            obj.status == "pending"
            and obj.to_user == request.user
        )