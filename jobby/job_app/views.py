from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone

from .serializers import JobSerializer, CandidatesAppliedSerializer
from .models import Job, CandidatesApplied
from django.shortcuts import get_object_or_404
from .filters import JobsFilter
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def getAllJobs(request):
    # Создание объекта фильтра и применение фильтров
    filterset = JobsFilter(request.GET, queryset=Job.objects.all().order_by('id'))

    # Получение общего количества элементов после применения фильтров
    count = filterset.qs.count()

    # Установка количества результатов на странице
    resPerPage = 3

    # Создание объекта пагинации
    paginator = PageNumberPagination()

    # Установка количества результатов на странице для пагинации
    paginator.page_size = resPerPage

    # Применение пагинации к отфильтрованным данным
    queryset = paginator.paginate_queryset(filterset.qs, request)

    # Создание сериализатора для данных
    serializer = JobSerializer(queryset, many=True)

    # Формирование и возврат HTTP-ответа
    return Response({
        "count": count,  # Общее количество элементов после фильтрации
        "resPerPage": resPerPage,  # Количество результатов на странице
        'jobs': serializer.data  # Данные о вакансиях после сериализации
    })


@api_view(['GET'])
def getJob(request, pk):
    job = get_object_or_404(Job, id=pk)

    serializer = JobSerializer(job, many=False)

    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def newJob(request):
    data = request.data

    job = Job.objects.create(**data)

    serializer = JobSerializer(job, many=False)
    return Response(serializer.data)


@api_view(['PUT'])

def updateJob(request, pk):
    job = get_object_or_404(Job, id=pk)

    if job.user != request.user:
        return Response({ 'message': 'You can not update this job' }, status=status.HTTP_403_FORBIDDEN)

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
@permission_classes([IsAuthenticated])
def deleteJob(request, pk):
    job = get_object_or_404(Job, id=pk)

    if job.user != request.user:
        return Response({ 'message': 'You can not delete this job' }, status=status.HTTP_403_FORBIDDEN)
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

@api_view(['POST'])
@permission_classes([IsAuthenticated])

# Определяем функцию applyToJob, которая принимает запрос и первичный ключ вакансии
def applyToJob(request, pk):

    user = request.user # Получаем пользователя, отправившего запрос
    job = get_object_or_404(Job, id=pk) # Получаем вакансию по первичному ключу или возвращаем 404 ошибку, если вакансия не найдена

    # Проверяем, загрузил ли пользователь свое резюме
    if user.userprofile.resume == '':
        return Response({ 'error': 'Please upload your resume first' }, status=status.HTTP_400_BAD_REQUEST)

    # Проверяем, не истек ли срок подачи заявок на вакансию
    if job.lastDate < timezone.now():
        return Response({ 'error': 'You can not apply to this job. Date is over' }, status=status.HTTP_400_BAD_REQUEST)

    # Проверяем, не подавал ли пользователь заявку на эту вакансию ранее
    alreadyApplied = job.candidatesapplied_set.filter(user=user).exists()

    if alreadyApplied:
        return Response({ 'error': 'You have already apply to this job.' }, status=status.HTTP_400_BAD_REQUEST)

    # Создаем новую заявку на вакансию
    jobApplied = CandidatesApplied.objects.create(
        job = job,
        user = user,
        resume = user.userprofile.resume
    )

    # Возвращаем ответ с информацией о том, что заявка успешно создана
    return Response({
        'applied': True,
        'job_id': jobApplied.id
    },
    status=status.HTTP_200_OK
    )

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCurrentUserAppliedJobs(request):

    args = { 'user_id': request.user.id }       # Аргументы для фильтрации запроса: идентификатор текущего пользователя

    jobs = CandidatesApplied.objects.filter(**args)    # Получение списка объектов CandidatesApplied, соответствующих критериям поиска

    serializer = CandidatesAppliedSerializer(jobs, many=True) # Сериализация данных. Преобразование списка объектов в формат, подходящий для передачи по HTTP

    return Response(serializer.data)              # Возвращение ответа HTTP с сериализованными данными


@api_view(['GET'])
@permission_classes([IsAuthenticated])

# Метод для проверки, подал ли аутентифицированный пользователь заявку на вакансию с поиском по id вакансии
def isApplied(request, pk):
    user = request.user  # получаем данные текущего пользователя
    job = get_object_or_404(Job, id=pk)  # получаем объект вакансии по id. Если такой вакансии нет, возвращаем 404 ошибку

    # проверяем, существует ли запись в таблице candidatesapplied с текущим пользователем и заданной вакансией
    # используем метод .exists() для возвращения булева значения
    applied = job.candidatesapplied_set.filter(user=user).exists()

    return Response(applied)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCurrentUserJobs(request):

    args = { 'user': request.user.id }

    jobs = Job.objects.filter(**args)
    serializer = JobSerializer(jobs, many=True)

    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getCandidatesApplied(request, pk):

    user = request.user
    job = get_object_or_404(Job, id=pk)

    if job.user != user:
        return Response({ 'error': 'You can not acces this job' }, status=status.HTTP_403_FORBIDDEN)

    candidates = job.candidatesapplied_set.all()

    serializer = CandidatesAppliedSerializer(candidates, many=True)

    return Response(serializer.data)