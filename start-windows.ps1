# PowerShell script for Windows users
# Run this with: powershell -ExecutionPolicy Bypass -File start-windows.ps1

Write-Host "🚀 Starting Sportzal Fitness on Windows..." -ForegroundColor Green

# Set environment variables
$env:NODE_ENV = "development"

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH" -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if dependencies are installed
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Check if .env file exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found. Creating from template..." -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "📝 .env file created from .env.example" -ForegroundColor Green
        Write-Host "Please edit .env file with your database URL and JWT secret" -ForegroundColor Yellow
        Read-Host "Press Enter to continue after editing .env"
    } else {
        Write-Host "❌ .env.example not found" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Start the server
Write-Host "🏃 Starting development server..." -ForegroundColor Green
Write-Host "🌐 Server will be available at: http://localhost:5000" -ForegroundColor Cyan

try {
    npx tsx server/index.ts
} catch {
    Write-Host "❌ Failed to start server" -ForegroundColor Red
    Write-Host "Check the error messages above for details" -ForegroundColor Yellow
}

Read-Host "Press Enter to exit"