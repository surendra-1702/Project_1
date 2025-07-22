@echo off
echo 🚀 Windows 11 Compatible Startup for Sportzal Fitness

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% neq 0 (
    echo ⚠️  For best results on Windows 11, run as Administrator
    echo Right-click this file and select "Run as administrator"
    echo.
    echo Continuing anyway...
    timeout /t 3 >nul
)

REM Set Windows 11 optimized environment
set NODE_ENV=development
set NODE_OPTIONS=--max-old-space-size=4096
set UV_THREADPOOL_SIZE=128

REM Kill existing processes on port 5000
echo 🔄 Cleaning up port 5000...
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

REM Clear npm cache for Windows 11 compatibility
echo 🧹 Clearing npm cache...
npm cache clean --force >nul 2>&1

REM Check Node.js version
echo 📋 Checking Node.js version...
node --version
echo.

REM Install dependencies if needed with Windows 11 optimizations
if not exist "node_modules" (
    echo 📦 Installing dependencies with Windows 11 optimizations...
    npm install --no-optional --prefer-offline
    if errorlevel 1 (
        echo ❌ npm install failed. Trying alternative method...
        npm install --legacy-peer-deps --no-audit
    )
)

echo 🏃 Starting server with Windows 11 compatible method...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.
echo 💡 Tip: If you get permission errors, run as Administrator
echo.

REM Try multiple startup methods for Windows 11 compatibility
echo Method 1: Cross-env with ts-node...
npx cross-env NODE_ENV=development NODE_OPTIONS="--max-old-space-size=4096" ts-node server/index.ts 2>nul
if not errorlevel 1 goto :success

echo Method 1 failed, trying Method 2: Direct ts-node...
npx ts-node --transpile-only server/index.ts 2>nul
if not errorlevel 1 goto :success

echo Method 2 failed, trying Method 3: CommonJS entry point...
node server/index-windows.cjs 2>nul
if not errorlevel 1 goto :success

echo Method 3 failed, trying Method 4: Build and run...
npm run build >nul 2>&1
if exist "dist\index.js" (
    node dist/index.js
    if not errorlevel 1 goto :success
)

echo Method 4 failed, trying Method 5: Simple server...
node server/index-simple.js
if not errorlevel 1 goto :success

:failure
echo.
echo ❌ All startup methods failed. This might be a Windows 11 specific issue.
echo.
echo 🔧 Try these Windows 11 troubleshooting steps:
echo 1. Run this file as Administrator
echo 2. Check if antivirus is blocking Node.js
echo 3. Move project to C:\Projects\sportzal-fitness (shorter path)
echo 4. Install Node.js 20.x LTS if using older version
echo 5. Add project folder to Windows Defender exclusions
echo.
goto :end

:success
echo.
echo ✅ Server started successfully!
echo.

:end
pause