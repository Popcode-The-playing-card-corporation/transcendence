from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import User
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response


from .serializers import UserSerializer

@api_view(["GET", "POST", "UPDATE"])
def list_users(request):
    if request.method == "GET":
        users = User.objects.all()
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)

    elif request.method == "POST":
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(["PUT", "PATCH"])
def update_user(request, id):
    user = get_object_or_404(User, id=id)
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
@api_view(["GET"])
def get_user(request, id):
    user = get_object_or_404(User, id=id)
    serializer = UserSerializer(user)
    return Response(serializer.data)