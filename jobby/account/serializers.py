from django.contrib.auth.models import User  # Импортируем модель User из Django
from rest_framework import serializers  # Импортируем класс serializers из Django REST framework

# Создаем сериализатор SignUpSerializer для регистрации пользователей
class SignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = User  # Указываем, что моделью для сериализации является User
        fields = ('first_name', 'last_name', 'email', 'password')  # Указываем поля, которые будут сериализованы

        # Задаем дополнительные параметры для полей
        extra_kwargs = {
            'first_name': { 'required': True, 'allow_blank': False },  # Имя пользователя обязательное, не пустое поле
            'last_name': { 'required': True, 'allow_blank': False },  # Фамилия пользователя обязательное, не пустое поле
            'email': { 'required': True, 'allow_blank': False },  # Электронная почта обязательное, не пустое поле
            'password': { 'required': True, 'allow_blank': False, 'min_length': 6 },  # Пароль обязателен, не пустой, минимальная длина 6 символов
        }

# Создаем сериализатор UserSerializer для пользователей
class UserSerializer(serializers.ModelSerializer):
    resume = serializers.CharField(source='userprofile.resume')  # Добавляем поле 'resume' из связанной модели UserProfile
    class Meta:
        model = User  # Указываем, что моделью для сериализации является User
        fields = ('first_name', 'last_name', 'email', 'username', 'resume')  # Указываем поля, которые будут сериализованы

