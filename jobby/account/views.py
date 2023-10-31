from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status

from django.contrib.auth.hashers import make_password
from .serializers import SignUpSerializer, UserSerializer

from rest_framework.permissions import IsAuthenticated

from django.contrib.auth.models import User

# Этот блок кода представляет собой Django view для регистрации пользователей.

# Определяем API endpoint с использованием декоратора api_view и указываем, что
# представление принимает только HTTP POST запросы.
@api_view(['POST'])
def register(request):
    data = request.data  # Получаем данные из запроса

    user = SignUpSerializer(data=data)  # Создаем экземпляр сериализатора SignUpSerializer с полученными данными

    if user.is_valid():  # Проверяем, прошли ли данные валидацию сериализатором
        if not User.objects.filter(username=data['email']).exists():  # Проверяем, не существует ли пользователь с таким email

            # Создаем нового пользователя, если email уникален, используя данные из запроса
            user = User.objects.create(
                first_name=data['first_name'],
                last_name=data['last_name'],
                username=data['email'],  # Используем email как username
                email=data['email'],
                password=make_password(data['password'])  # Хешируем пароль перед сохранением
            )

            return Response({
                'message': 'User registered.'},  # Возвращаем успешный ответ с сообщением
                status=status.HTTP_200_OK
            )
        else:
            return Response({
                'error': 'User already exists'},  # Возвращаем ошибку, если пользователь с таким email уже существует
                status=status.HTTP_400_BAD_REQUEST
            )
    else:
        return Response(user.errors)  # Возвращаем ошибку валидации, если данные не прошли валидацию


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUser(request):
    user = request.user


    data = request.data

    user.first_name = data['first_name']
    user.last_name = data['last_name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Применяем проверку аутентификации с использованием IsAuthenticated

def currentUser(request):
    user = UserSerializer(request.user)  # Создаем сериализатор для текущего пользователя из запроса

    return Response(user.data)  # Возвращаем данные текущего пользователя в виде JSON-ответа
