from rest_framework import serializers
from .models import Job


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        # Указываем модель, которая будет сериализована и десериализована
        model = Job

        # fields = '__all__' означает, что будут сериализованы все поля модели Job
        fields = '__all__'
