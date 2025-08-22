from django.db import models

class Processe(models.Model):
    name = models.CharField(max_length=100 , null=True , blank=True)
    pid =models.IntegerField(null=True , blank=True , help_text="Process id")
    cpu = models.FloatField(null=True , blank=True )
    memory =models.FloatField(null=True , blank=True )
    parent_pid = models.IntegerField(null=True , blank=True )
    hostname = models.CharField(max_length=100 , null=True , blank=True)
    timestamp =models.DateTimeField(auto_now_add=True,null=True , blank=True ) 

    def __str__(self):
        return f"{self.name}(PID{self.pid})"

from django.db import models

class SystemInfo(models.Model):
    hostname = models.CharField(max_length=255)
    os = models.CharField(max_length=255, blank=True, null=True)
    processor = models.CharField(max_length=255, blank=True, null=True)
    cores = models.IntegerField(default=0)
    threads = models.IntegerField(default=0)
    ram_gb = models.IntegerField(default=0)
    used_ram_gb = models.IntegerField(default=0)
    available_ram_gb = models.IntegerField(default=0)
    storage_total_gb = models.IntegerField(default=0)
    storage_free_gb = models.IntegerField(default=0)
    storage_used_gb = models.IntegerField(default=0)
    timestamp = models.DateTimeField()


# Create your models here.
