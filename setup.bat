@echo off
REM Smart Expense Tracker - Setup Script for Windows

echo 🚀 Setting up Smart Expense Tracker...

REM Check prerequisites
echo Checking prerequisites...

where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js not found. Please install from nodejs.org
    exit /b 1
)
echo ✓ Node.js installed

where python >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Python not found. Please install from python.org
    exit /b 1
)
echo ✓ Python installed

REM Create Environment Files
echo.
echo Creating environment files...

if not exist "backend\.env" (
    copy backend\.env.example backend\.env
    echo ✓ Created backend\.env
) else (
    echo ⚠ backend\.env already exists
)

if not exist "python-worker\.env" (
    copy python-worker\.env.example python-worker\.env
    echo ✓ Created python-worker\.env
    echo ⚠ Remember to add your GROQ_API_KEY to python-worker\.env
) else (
    echo ⚠ python-worker\.env already exists
)

REM Install dependencies
echo.
echo Installing dependencies...

echo Installing backend dependencies...
cd backend
call npm install
cd ..
echo ✓ Backend ready

echo Installing frontend dependencies...
cd frontend
call npm install
cd ..
echo ✓ Frontend ready

echo Setting up Python environment...
cd python-worker
if not exist "venv" (
    python -m venv venv
    echo ✓ Python virtual environment created
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
cd ..
echo ✓ Python environment ready

REM Summary
echo.
echo ========================================
echo ✓ Setup complete!
echo ========================================
echo.
echo Next steps:
echo 1. Edit python-worker\.env and add your Groq API key
echo 2. Run services in separate terminals:
echo    - Backend:  cd backend ^&^& npm run dev
echo    - Python:   cd python-worker ^&^& python main.py
echo    - Frontend: cd frontend ^&^& npm run dev
echo.
echo Or use Docker Compose:
echo    docker-compose up
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:5000
echo Python:   http://localhost:8000
