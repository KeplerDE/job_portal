from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

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


@api_view(['POST'])
def newJob(request):
    data = request.data

    job = Job.objects.create(**data)

    serializer = JobSerializer(job, many=False)
    return Response(serializer.data)


@api_view(['PUT'])
def updateJob(request, pk):
    job = get_object_or_404(Job, id=pk)

    # Обновление полей объекта job данными из запроса
    job.title = request.data['title']
    job.description = request.data['description']
    job.email = request.data['email']
    job.address = request.data['address']
    job.jobType = request.data['jobType']
    job.education = request.data['education']
    job.industry = request.data['industry']
    job.experience = request.data['experience']
    job.salary = request.data['salary']
    job.positions = request.data['positions']
    job.company = request.data['company']

    # Сохранение обновленного объекта
    job.save()

    serializer = JobSerializer(job, many=False)

    return Response(serializer.data)

@api_view(['DELETE'])
def deleteJob(request, pk):
    # Получаем объект вакансии с заданным идентификатором (pk) или возвращаем ошибку 404, если он не существует
    job = get_object_or_404(Job, id=pk)
    print(job)
    # Удаляем объект вакансии из базы данных.
    job.delete()

    # Возвращаем JSON-ответ, сообщая, что вакансия была удалена, и код состояния HTTP 200 (OK)
    return Response({'message': 'Job is Deleted.'}, status=status.HTTP_200_OK)


@api_view(['GET'])
def getTopicStats(request, topic):
    # Создаем словарь аргументов для фильтрации вакансий, где заголовок содержит указанную тему.
    args = { 'title__icontains': topic }

    # Используем фильтрацию для получения вакансий, соответствующих заданным аргументам.
    jobs = Job.objects.filter(**args)

    # Проверяем, были ли найдены вакансии для заданной темы.
    if len(jobs) == 0:
        return Response({ 'message': 'No stats found for {topic}'.format(topic=topic) })

    # Выполняем агрегацию статистики по найденным вакансиям.
    stats = jobs.aggregate(
        total_jobs = Count('title'),   # Общее количество вакансий
        avg_positions = Avg('positions'),  # Среднее количество позиций
        avg_salary = Avg('salary'),   # Средняя зарплата
        min_salary = Min('salary'),   # Минимальная зарплата
        max_salary = Max('salary')    # Максимальная зарплата
    )

    # Возвращаем результаты агрегации в ответе HTTP.
    return Response(stats)


