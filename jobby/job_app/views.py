from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


from .serializers import JobSerializer
from .models import Job
from django.shortcuts import get_object_or_404


@api_view(['GET'])
def getAllJobs(request):
    # Получаем все объекты модели Job из базы данных
    jobs = Job.objects.all()

    # Создаем сериализатор JobSerializer, который будет использоваться для преобразования объектов Job в JSON
    serializer = JobSerializer(jobs, many=True)

    # Возвращаем HTTP-ответ с данными, полученными из сериализатора, в формате JSON
    return Response(serializer.data)


@api_view(['GET'])
def getJob(request, pk):
    job = get_object_or_404(Job, id=pk)

    serializer = JobSerializer(job, many=False)

    return Response(serializer.data)