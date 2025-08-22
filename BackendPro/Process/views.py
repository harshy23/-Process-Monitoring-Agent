from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Processe , SystemInfo
from .serialisers import Processeserialiser ,SystemInfoSerializer
API_KEY = "hf4n6h894m964f5gm9kdfm"


@api_view(["POST"])
def data_from_agent(request):

    Agent_key = request.headers.get("API_KEY")
    if Agent_key != API_KEY:
        return Response({"error":"unauthorized"},status=401)
    hostname = request.data.get("hostname")
    timestamp =request.data.get("timestamp")
    Processes =request.data.get("processes")
    system = request.data.get("system")

    system["hostname"] = hostname
    system["timestamp"] = timestamp

    sys_ser = SystemInfoSerializer(data=system)
    
    if sys_ser.is_valid():
        sys_ser.save()

    for pro in Processes:
        Pro_data ={
            "name":pro["name"],
            "pid":pro["pid"],
            "cpu":pro["cpu"],
            "memory": pro["memory"],
            "parent_pid" :pro["parent_pid"],
            "hostname" : hostname,
            "timestamp":timestamp
        }
        serialised =Processeserialiser(data =Pro_data)
        if serialised.is_valid():
            serialised.save()
    return Response({"message":"Data saved succefully"},status=200)

@api_view(["GET"])
def Process_to_frontend(request):
    processess = Processe.objects.all().order_by("-timestamp")[:50]
    serilised = Processeserialiser(processess ,many = True)
    return Response({"message":"data send", "data":serilised.data}) 
@api_view(["GET"])
def system_to_frontend(request):
    row = SystemInfo.objects.all().order_by("-timestamp").first()
    if not row:
        return Response({"message":"no data","data":{}}, status=200)
    return Response({"message":"ok", "data": SystemInfoSerializer(row).data})  
     


# Create your views here.
