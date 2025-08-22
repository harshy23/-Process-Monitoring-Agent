import socket
import platform
import psutil
import shutil
import psutil
import requests
import json
from datetime import datetime
API_KEY = "hf4n6h894m964f5gm9kdfm"
BACKEND_URL = "http://127.0.0.1:8000/api/process-data/"
def collect_task():
    process = []

    for pro in psutil.process_iter(['pid', 'name', 'cpu_percent', 'memory_percent', 'ppid']):
        try:
            inf = pro.info
            process.append({
                "pid": inf["pid"],
                "name": inf["name"],
                "cpu": inf["cpu_percent"],
                "memory": inf["memory_percent"],
                "parent_pid": inf["ppid"]
            })
        except (psutil.NoSuchProcess , psutil.AccessDenied):
            continue
    return process
def collect_system():
    uname = platform.uname()
    vm = psutil.virtual_memory()
    du = shutil.disk_usage("/")  # change to specific drive if needed, e.g., "C:\\"
    cpu_count = psutil.cpu_count(logical=False) or 0
    cpu_threads = psutil.cpu_count(logical=True) or 0

    return {
        "hostname": socket.gethostname(),
        "os": f"{uname.system} {uname.release} {uname.version}",
        "processor": uname.processor or platform.processor(),
        "cores": cpu_count,
        "threads": cpu_threads,
        "ram_gb": round(vm.total / (1024**3)),
        "used_ram_gb": round((vm.total - vm.available) / (1024**3)),
        "available_ram_gb": round(vm.available / (1024**3)),
        "storage_total_gb": round(du.total / (1024**3)),
        "storage_free_gb": round(du.free / (1024**3)),
        "storage_used_gb": round((du.total - du.free) / (1024**3)),
    }
def backend_request(data):
    header = {"Content-Type": "application/json", "API-Key": API_KEY}

    try:
        response = requests.post(BACKEND_URL,headers=header,data=json.dumps(data))
        print(response.status_code,response.text)
    except Exception as e:
        print("error during sendinf data" , e)
if __name__=="__main__":
    hostname = socket.gethostname()
    timestamp = datetime.now().isoformat()

    payload={
        "hostname":hostname,
        "timestamp":timestamp,
        "system": collect_system(),
        "processes":collect_task(),
        
    }

    print(payload)

    backend_request(payload)