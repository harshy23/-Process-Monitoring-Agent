from django.urls import path
from .import views 
urlpatterns = [
   path("api/process-data/",views.data_from_agent,name="process-data"),
   path("api/process-data-view/",views.Process_to_frontend,name="Process_to_frontend"),
   path("api/system-info/",views.system_to_frontend,name="system_to_frontend")
]