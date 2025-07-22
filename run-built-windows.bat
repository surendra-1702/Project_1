@echo off
echo 🚀 Windows Built Version Startup

REM Set environment
set NODE_ENV=production

REM Kill existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo 🏗️ Building Windows-compatible version...
node build-windows.js

if exist "dist\index-windows.cjs" (
    echo 🏃 Starting built Windows version...
    echo 🌐 Access at: http://localhost:5000
    echo 👤 Login: admin@sportzalfitness.com / admin123
    echo.
    node dist/index-windows.cjs
) else (
    echo ❌ Build failed
    pause
    exit /b 1
)

pause