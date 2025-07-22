@echo off
echo 🚀 Windows Alternative Startup (No ES Module)

REM Set environment
set NODE_ENV=development

REM Kill existing processes on port 5000
for /f "tokens=5" %%a in ('netstat -ano 2^>nul ^| findstr :5000') do (
    taskkill /PID %%a /F >nul 2>&1
)

echo 🔧 Using Windows-compatible configuration...

REM Backup original package.json
if not exist "package.json.backup" (
    copy package.json package.json.backup
    echo 📦 Backed up original package.json
)

REM Use the Windows-compatible package.json
copy package-windows.json package.json

echo 🏃 Starting server with ts-node (CommonJS mode)...
echo 🌐 Access at: http://localhost:5000
echo 👤 Login: admin@sportzalfitness.com / admin123
echo.

REM Use ts-node with CommonJS
npx ts-node server/index.ts

REM Restore original package.json
if exist "package.json.backup" (
    copy package.json.backup package.json
    echo 📦 Restored original package.json
)

pause