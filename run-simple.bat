@echo off
echo 🚀 Simple Windows Startup for Sportzal Fitness

REM Set environment
set NODE_ENV=development

REM Kill existing processes on port 5000
echo 🔄 Clearing port 5000...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🏃 Starting server...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.

REM Use the Windows-compatible entry point
node server/index-windows.js

pause