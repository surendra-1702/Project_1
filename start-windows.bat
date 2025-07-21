@echo off
echo 🚀 Starting Sportzal Fitness on Windows...

REM Set environment variables
set NODE_ENV=development

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
)

REM Start the server using npx tsx
echo 🏃 Starting development server...
npx tsx server/index.ts

pause