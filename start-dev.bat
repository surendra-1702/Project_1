@echo off
echo 🚀 Starting Sportzal Fitness Development Server...

REM Check Node.js version
for /f "tokens=*" %%i in ('node --version 2^>nul') do set NODE_VERSION=%%i
if "%NODE_VERSION%"=="" (
    echo ❌ Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)
echo ✅ Node.js version: %NODE_VERSION%

REM Set environment variables
set NODE_ENV=development
set NODE_OPTIONS=--loader tsx/esm

REM Check if .env exists
if not exist ".env" (
    echo ⚠️  .env file not found
    if exist ".env.example" (
        copy ".env.example" ".env"
        echo 📝 Created .env from template
        echo Please edit .env file with your database credentials
        pause
    ) else (
        echo ❌ .env.example not found
        pause
        exit /b 1
    )
)

REM Check if dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing dependencies...
    npm install
    if errorlevel 1 (
        echo ❌ Failed to install dependencies
        pause
        exit /b 1
    )
)

REM Kill any existing process on port 5000
echo 🔄 Checking port 5000...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    echo Killing process %%a
    taskkill /PID %%a /F >nul 2>&1
)

REM Start the server with multiple fallback methods
echo 🏃 Starting development server...
echo 🌐 Server will be available at: http://localhost:5000
echo 👤 Admin login: admin@sportzalfitness.com / admin123
echo.

REM Try method 1: Windows-compatible CommonJS entry point
echo Method 1: Using Windows CommonJS entry...
node server/index-windows.cjs
if not errorlevel 1 goto :end

REM Try method 2: ts-node directly
echo Method 2: Using ts-node...
npx ts-node server/index.ts
if not errorlevel 1 goto :end

REM Try method 3: cross-env with tsx
echo Method 3: Using cross-env...
npx cross-env NODE_ENV=development tsx server/index.ts
if not errorlevel 1 goto :end

REM Try method 4: node.js script
echo Method 4: Using Node.js script...
node run-windows.js
if not errorlevel 1 goto :end

REM Try method 5: Build and run
echo Method 5: Building and running...
npm run build 2>nul && npm start
if not errorlevel 1 goto :end

echo ❌ All methods failed. Check TROUBLESHOOTING.md

:end
pause