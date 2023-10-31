from django.db import models  # Импортируем модуль models из Django
from django.contrib.auth.models import User  # Импортируем модель User из модуля auth Django


# Создаем модель UserProfile, которая связана с моделью User с помощью OneToOneField.
# Это позволяет каждому пользователю иметь один профиль, содержащий дополнительные данные, такие как резюме
class UserProfile(models.Model):
    user = models.OneToOneField(User, related_name='userprofile', on_delete=models.CASCADE)
    # Связываем UserProfile с User через OneToOneField, используя related_name 'userprofile'
    # related_name позволяет обращаться к профилю пользователя через объект User

    resume = models.FileField(null=True)  # Поле для загрузки файла резюме, с опциональной возможностью хранения None
