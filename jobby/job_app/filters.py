from django_filters import rest_framework as filters
from .models import Job

class JobsFilter(filters.FilterSet):

    # Фильтрация по ключевому слову (поле 'title') - ищем вхождения без учета регистра
    keyword = filters.CharFilter(field_name='title', lookup_expr='icontains')

    # Фильтрация по местоположению (поле 'address') - ищем вхождения без учета регистра
    location = filters.CharFilter(field_name='address', lookup_expr='icontains')

    # Фильтрация по минимальной зарплате (поле 'salary') - значение должно быть больше или равно заданной величине
    min_salary = filters.NumberFilter(field_name="salary" or 0, lookup_expr='gte')

    # Фильтрация по максимальной зарплате (поле 'salary') - значение должно быть меньше или равно заданной величине
    max_salary = filters.NumberFilter(field_name="salary" or 1000000, lookup_expr='lte')

    class Meta:
        model = Job
        fields = ('keyword', 'location', 'education', 'jobType', 'experience', 'min_salary', 'max_salary')
