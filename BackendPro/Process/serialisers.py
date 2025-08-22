from rest_framework import serializers
from .models import Processe ,SystemInfo

class Processeserialiser(serializers.ModelSerializer):
    class Meta:
        model =Processe
        fields= "__all__"

class SystemInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = SystemInfo
        fields = "__all__"