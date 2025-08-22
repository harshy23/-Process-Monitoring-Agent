# Process Monitoring System

## Overview
This project consists of three main components:
- **BackendPro**: Django REST API backend
- **FrontendPro**: Vite/JavaScript frontend
- **Agent**: Python-based system monitoring agent, compiled to an executable

---

## 1. Build Instructions

### Backend (Django)
- Install dependencies:
  ```sh
  pip install -r BackendPro/requirements.txt
  ```
- Run migrations:
  ```sh
  python BackendPro/manage.py migrate
  ```
- Start the server:
  ```sh
  python BackendPro/manage.py runserver
  ```
  Or for production (Render):
  ```sh
  gunicorn BackendPro.wsgi
  ```

### Agent (Python EXE)
- Install PyInstaller:
  ```sh
  pip install pyinstaller
  ```
- Compile Agent to EXE:
  ```sh
  cd Agent
  pyinstaller --onefile Agent.py
  ```
  The executable will be in `Agent/dist/Agent.exe`.

### Frontend (Vite)
- Install dependencies:
  ```sh
  cd FrontendPro/FrontendPro
  npm install
  ```
- Build frontend:
  ```sh
  npm run build
  ```
- For deployment (Render):
  - Root Directory: `FrontendPro/FrontendPro`
  - Publish Directory: `dist`

---

## 2. Configuration
- **CORS**: Ensure `django-cors-headers` is installed and configured in `BackendPro/settings.py`:
  ```python
  INSTALLED_APPS = [
      ...
      'corsheaders',
      ...
  ]
  MIDDLEWARE = [
      'corsheaders.middleware.CorsMiddleware',
      ...
  ]
  CORS_ALLOWED_ORIGINS = [
      "https://process-monitoring-agent-2.onrender.com",
  ]
  ```
- **Database**: Uses SQLite by default (`BackendPro/db.sqlite3`).
- **API URLs**: Backend API endpoints are under `/api/`.

---

## 3. Architecture Overview
- **Agent**: Collects system/process info and sends it to the backend API.
- **BackendPro**: Django REST API for storing and serving system/process data.
- **FrontendPro**: Fetches and displays data from the backend API for users.

---

## 4. API Specifications
- `GET /api/system-info/` — Returns system information.
- `GET /api/process-data-view/` — Returns process data.
- `POST /api/process-data-view/` — Accepts process data from agent.

---

## 5. Assumptions
- The agent and backend are deployed separately; agent posts data to backend API.
- Frontend and backend may be on different domains; CORS must be enabled.
- SQLite is used for development.
- All API endpoints are prefixed with `/api/`.

---

<!-- ## 6. Useful Links
- [Django Documentation](https://docs.djangoproject.com/)
- [Vite Documentation](https://vitejs.dev/)
- [PyInstaller Documentation](https://pyinstaller.org/)
- [django-cors-headers](https://github.com/adamchainz/django-cors-headers) -->
