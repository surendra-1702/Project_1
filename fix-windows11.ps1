# Windows 11 Fix Script for Sportzal Fitness
# Run this in PowerShell as Administrator

Write-Host "🔧 Windows 11 Compatibility Fix for Sportzal Fitness" -ForegroundColor Green
Write-Host ""

# Check if running as Administrator
if (-NOT ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole] "Administrator")) {
    Write-Host "❌ This script needs to run as Administrator" -ForegroundColor Red
    Write-Host "Right-click PowerShell and select 'Run as Administrator'" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

Write-Host "✅ Running as Administrator" -ForegroundColor Green

# Set execution policy for current user
Write-Host "🔑 Setting PowerShell execution policy..."
try {
    Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
    Write-Host "✅ Execution policy updated" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not update execution policy: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Check Node.js version
Write-Host "📋 Checking Node.js version..."
try {
    $nodeVersion = node --version
    Write-Host "Node.js version: $nodeVersion" -ForegroundColor Cyan
    
    # Check if it's a recommended version
    if ($nodeVersion -match "v(18|20)\.") {
        Write-Host "✅ Good Node.js version for Windows 11" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Consider upgrading to Node.js 18.x or 20.x LTS" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Clear npm cache
Write-Host "🧹 Clearing npm cache..."
try {
    npm cache clean --force
    Write-Host "✅ npm cache cleared" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not clear npm cache" -ForegroundColor Yellow
}

# Set Windows 11 environment variables
Write-Host "🔧 Setting Windows 11 optimized environment variables..."
$env:NODE_OPTIONS = "--max-old-space-size=4096"
$env:UV_THREADPOOL_SIZE = "128"
$env:NODE_ENV = "development"
Write-Host "✅ Environment variables set" -ForegroundColor Green

# Add Windows Defender exclusions (optional)
Write-Host "🛡️  Would you like to add the project folder to Windows Defender exclusions? (Recommended for better performance)"
$addExclusion = Read-Host "Type 'yes' to add exclusion, or press Enter to skip"
if ($addExclusion -eq "yes") {
    try {
        $projectPath = Get-Location
        Add-MpPreference -ExclusionPath $projectPath
        Add-MpPreference -ExclusionPath "$projectPath\node_modules"
        Write-Host "✅ Added Windows Defender exclusions" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not add Windows Defender exclusions: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Enable long path support
Write-Host "📁 Enabling long path support..."
try {
    Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1
    Write-Host "✅ Long path support enabled (restart may be required)" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not enable long path support: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Windows 11 compatibility fixes applied!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Close this PowerShell window" -ForegroundColor White
Write-Host "2. Open a new Command Prompt or PowerShell" -ForegroundColor White
Write-Host "3. Navigate to your project folder" -ForegroundColor White
Write-Host "4. Run: run-windows11.bat" -ForegroundColor White
Write-Host ""
Write-Host "If you still have issues:" -ForegroundColor Yellow
Write-Host "- Try moving the project to C:\Projects\sportzal-fitness" -ForegroundColor White
Write-Host "- Restart your computer" -ForegroundColor White
Write-Host "- Check Windows 11 Compatibility Guide" -ForegroundColor White

Read-Host "Press Enter to exit"