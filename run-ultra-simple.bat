@echo off
echo 🚀 Ultra Simple Windows Startup for Sportzal Fitness

REM Kill existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Set environment
set NODE_ENV=development

echo 🏃 Starting server using ts-node...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.

REM Use ts-node directly (most compatible with Windows)
npx ts-node server/index.ts

pause