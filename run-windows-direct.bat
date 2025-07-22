@echo off
echo 🚀 Direct Windows Startup for Sportzal Fitness

REM Set environment
set NODE_ENV=development

REM Kill existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

echo 🏃 Starting server with Node.js compatible method...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.

REM Build the project first
echo Building project...
npm run build

REM Then run the built version
if exist "dist\index.js" (
    echo Running built version...
    node dist/index.js
) else (
    echo Build failed, trying alternative method...
    npm start
)

pause