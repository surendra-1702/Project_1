@echo off
echo 🚀 Simple Server for Windows Testing

REM Set environment
set NODE_ENV=development

REM Kill existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo 🏃 Starting simple JavaScript server...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.
echo This is a simplified server for Windows testing
echo.

node server/index-simple.js

pause