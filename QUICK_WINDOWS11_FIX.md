# Quick Windows 11 Fix

If you're getting errors on Windows 11 that didn't happen on Windows 10, follow these steps:

## Immediate Fix (5 minutes)

### Step 1: Run as Administrator
1. **Right-click** on Command Prompt
2. **Select** "Run as administrator"
3. **Navigate** to your project: `cd "C:\Users\preet\Desktop\Project_1-main"`

### Step 2: Clear Everything
```cmd
npm cache clean --force
rmdir /s node_modules
del package-lock.json
```

### Step 3: Reinstall with Windows 11 Optimizations
```cmd
npm install --no-optional --legacy-peer-deps
```

### Step 4: Use Windows 11 Compatible Startup
```cmd
run-windows11.bat
```

## If Still Not Working - PowerShell Fix

### Step 1: Open PowerShell as Administrator
1. **Right-click** PowerShell
2. **Select** "Run as administrator"

### Step 2: Run the Fix Script
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
.\fix-windows11.ps1
```

### Step 3: Restart and Try Again
1. **Restart** your laptop
2. **Run**: `run-windows11.bat`

## Common Windows 11 vs Windows 10 Differences

| Issue | Windows 10 | Windows 11 |
|-------|------------|------------|
| Script Execution | Usually allowed | Blocked by default |
| Node.js Permissions | Relaxed | Stricter |
| Path Length | More tolerant | Stricter limits |
| Antivirus Scanning | Basic | More aggressive |
| ES Modules | Basic support | Enhanced but stricter |

## Emergency Fallback Methods

If nothing works, try these in order:

### Method 1: Move Project to Root
```cmd
# Move to C:\sportzal\ instead of long Desktop path
```

### Method 2: Use Simple Server
```cmd
node server/index-simple.js
```

### Method 3: Build First
```cmd
npm run build
npm start
```

### Method 4: Use Cross-env
```cmd
npx cross-env NODE_ENV=development ts-node server/index.ts
```

## The Root Cause

Windows 11 has:
- **Stricter security policies** than Windows 10
- **Different Node.js module loading** behavior
- **Enhanced Windows Defender** that blocks more operations
- **Tighter PowerShell execution** policies

The `run-windows11.bat` file addresses all these differences and should work reliably on your Windows 11 laptop.