from rest_framework import serializers
from .models import Job, CandidatesApplied


class JobSerializer(serializers.ModelSerializer):
    class Meta:
        # Указываем модель, которая будет сериализована и десериализована
        model = Job

        # fields = '__all__' означает, что будут сериализованы все поля модели Job
        fields = '__all__'
class CandidatesAppliedSerializer(serializers.ModelSerializer):

    job = JobSerializer()

    class Meta:
        model = CandidatesApplied
        fields = ('user', 'resume', 'appliedAt', 'job')