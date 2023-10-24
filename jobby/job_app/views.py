from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


from .serializers import JobSerializer
from .models import Job


@api_view(['GET'])
def getAllJobs(request):
    # Получаем все объекты модели Job из базы данных
    jobs = Job.objects.all()

    # Создаем сериализатор JobSerializer, который будет использоваться для преобразования объектов Job в JSON
    serializer = JobSerializer(jobs, many=True)

    # Возвращаем HTTP-ответ с данными, полученными из сериализатора, в формате JSON
    return Response(serializer.data)
