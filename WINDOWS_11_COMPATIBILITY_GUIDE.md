# Windows 11 Compatibility Guide for Sportzal Fitness

Windows 11 has stricter security policies and different Node.js behavior that can cause issues. Here are the solutions:

## Common Windows 11 Issues & Solutions

### Issue 1: PowerShell Execution Policy
Windows 11 blocks script execution by default.

**Solution:**
```powershell
# Run as Administrator in PowerShell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Issue 2: Node.js Version Compatibility
Windows 11 works best with specific Node.js versions.

**Solution:**
- Use Node.js 18.x or 20.x LTS
- Avoid Node.js 19.x or 21.x (unstable on Windows 11)

### Issue 3: Windows Defender SmartScreen
May block npm packages or batch files.

**Solution:**
1. Open Windows Security
2. Go to App & browser control
3. Turn off SmartScreen for Microsoft Store apps
4. Allow npm and node.exe through firewall

### Issue 4: ES Module Path Resolution
Windows 11 has stricter path handling.

**Solution:** Use our Windows 11 specific startup method.

## Windows 11 Startup Methods (Try in Order)

### Method 1: PowerShell Compatible
```powershell
# In PowerShell (recommended for Windows 11)
npm run dev-win11
```

### Method 2: Command Prompt Compatible
```cmd
# In Command Prompt
run-windows11.bat
```

### Method 3: VS Code Terminal
```bash
# In VS Code terminal
npx cross-env NODE_ENV=development ts-node --esm server/index.ts
```

### Method 4: Safe Mode
```bash
# Fallback method
node server/index-windows.cjs
```

## Windows 11 Specific Environment Setup

### Step 1: Check Node.js Version
```bash
node --version
# Should be v18.x.x or v20.x.x
```

### Step 2: Clear npm Cache
```bash
npm cache clean --force
```

### Step 3: Reinstall Dependencies
```bash
rmdir /s node_modules
del package-lock.json
npm install
```

### Step 4: Set Windows 11 Environment Variables
```cmd
set NODE_OPTIONS=--max-old-space-size=4096
set NODE_ENV=development
```

## Troubleshooting Windows 11 Errors

### Error: "Access Denied" or "Permission Denied"
**Cause:** Windows 11 User Account Control
**Solution:**
1. Right-click Command Prompt → "Run as Administrator"
2. Navigate to project folder
3. Run startup command

### Error: "Script execution is disabled"
**Cause:** PowerShell execution policy
**Solution:**
```powershell
# Run in PowerShell as Administrator
Set-ExecutionPolicy Bypass -Scope Process -Force
```

### Error: "ENOENT: no such file or directory"
**Cause:** Windows 11 path length limits
**Solution:** Move project closer to root:
```
C:\Projects\sportzal-fitness
```
Instead of:
```
C:\Users\username\Desktop\very\long\path\Project_1-main
```

### Error: "Cannot resolve module" or "Module not found"
**Cause:** Windows 11 case sensitivity changes
**Solution:**
```bash
# Clear everything and reinstall
npm cache clean --force
rmdir /s node_modules
npm install --no-optional
```

## Windows 11 Recommended Setup

### Use Windows Terminal (Better than Command Prompt)
1. Install from Microsoft Store: "Windows Terminal"
2. Set as default terminal
3. Use PowerShell or Command Prompt tabs

### Configure Windows 11 for Development
1. **Enable Developer Mode:**
   - Settings → Privacy & Security → For developers → Developer Mode: On

2. **Configure Windows Defender:**
   - Add project folder to exclusions
   - Settings → Privacy & Security → Windows Security → Virus & threat protection → Exclusions

3. **Set Long Path Support:**
   - Run as Admin: `gpedit.msc`
   - Computer Configuration → Administrative Templates → System → Filesystem
   - Enable "Enable Win32 long paths"

## Windows 11 Optimized Scripts

These scripts are specifically designed for Windows 11 compatibility and will be created automatically.

### Quick Fix for Windows 11
If you're getting errors, run this sequence:
```cmd
# 1. Clear everything
npm cache clean --force

# 2. Set environment
set NODE_OPTIONS=--max-old-space-size=4096

# 3. Use Windows 11 compatible method
run-windows11.bat
```

## Performance Tips for Windows 11

1. **Disable Windows Search indexing** for node_modules folder
2. **Add npm folder to antivirus exclusions**
3. **Use SSD storage** for Node.js projects
4. **Close unnecessary apps** while running the server
5. **Use wired internet** instead of WiFi for npm installs

## Success Indicators for Windows 11

You know it's working when:
- ✅ No "Access Denied" errors
- ✅ npm commands run without permission prompts
- ✅ Server starts without ES module errors
- ✅ Browser loads http://localhost:5000
- ✅ No Windows Defender blocking notifications

The key difference with Windows 11 is that it requires more explicit permissions and has stricter security policies than Windows 10.