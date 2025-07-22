@echo off
echo 🚀 Windows ts-node Startup for Sportzal Fitness

REM Set environment
set NODE_ENV=development

REM Kill existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo 🏃 Starting server with Windows-compatible ts-node...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.

REM Use Windows-compatible ts-node configuration
npx ts-node --project tsconfig-windows.json server/index.ts

pause