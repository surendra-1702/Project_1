# Complete VS Code Setup Guide for Windows

This guide will help you run Sportzal Fitness in VS Code on Windows, avoiding the ESM URL scheme error.

## 📋 Prerequisites

1. **Node.js 18+** - Download from https://nodejs.org/
2. **VS Code** - Download from https://code.visualstudio.com/
3. **Git** (optional) - For cloning the repository

## 🚀 Step-by-Step Setup

### Step 1: Open Project in VS Code

1. **Download/Extract** the project to your computer (e.g., `C:\Users\YourName\Desktop\sportzal-fitness`)
2. **Open VS Code**
3. **File > Open Folder** or press `Ctrl+K, Ctrl+O`
4. **Select** your project folder
5. **Trust the workspace** when prompted

### Step 2: Install Recommended Extensions

VS Code will show a notification about recommended extensions:

1. **Click "Install All"** or manually install:
   - TypeScript and JavaScript Language Features
   - Tailwind CSS IntelliSense
   - ESLint
   - Prettier - Code formatter
   - Thunder Client (for API testing)

### Step 3: Setup Environment Variables

1. **Copy environment file**:
   - Right-click `.env.example` in VS Code Explorer
   - Select "Copy"
   - Right-click in the same folder and "Paste"
   - Rename the copy to `.env`

2. **Edit .env file**:
   ```env
   # Required
   DATABASE_URL="your-database-url-here"
   JWT_SECRET="hhUuWsnzQgBZnNxSgtFw5zOI4KUm4ZrVhEuu6V1Rmw0="
   NODE_ENV="development"
   
   # Optional - for AI features
   DEEPSEEK_API_KEY="your-deepseek-key-here"
   ```

### Step 4: Install Dependencies

1. **Open VS Code Terminal**: `Ctrl+`` (backtick)
2. **Run installation**:
   ```bash
   npm install
   ```
3. **Wait for completion** (this may take a few minutes)

### Step 5: Setup Database

1. **In the terminal, run**:
   ```bash
   npm run db:push
   ```
2. **Initialize with admin user**:
   ```bash
   node scripts/setup-database.js
   ```

### Step 6: Start the Application (Windows-Specific)

Due to Windows ESM issues, use these methods in order:

#### **Method A: VS Code Task (Recommended)**
1. **Press**: `Ctrl+Shift+P`
2. **Type**: "Tasks: Run Task"
3. **Select**: "Start Development Server"

#### **Method B: Windows Batch File**
1. **In VS Code terminal**:
   ```bash
   start-dev.bat
   ```

#### **Method C: Cross-env Method**
1. **In VS Code terminal**:
   ```bash
   npx cross-env NODE_ENV=development tsx server/index.ts
   ```

#### **Method D: Node.js Script**
1. **In VS Code terminal**:
   ```bash
   node run-windows.js
   ```

### Step 7: Access the Application

1. **Open browser** to: http://localhost:5000
2. **Login with admin credentials**:
   - Email: `admin@sportzalfitness.com`
   - Password: `admin123`

## 🔧 VS Code Development Features

### Debugging Setup

1. **Set breakpoints** by clicking left margin of code lines
2. **Start debugging**:
   - Press `F5`
   - Or go to Run and Debug panel (`Ctrl+Shift+D`)
   - Select "Start Sportzal Fitness"
   - Click green play button

### Available Tasks

Press `Ctrl+Shift+P` and type "Tasks: Run Task":

- **Start Development Server** - Run the full application
- **Setup Database** - Create database tables
- **Initialize Database with Admin** - Add admin user
- **Open Database Studio** - Visual database editor
- **Type Check** - Validate TypeScript
- **Health Check** - Test server connectivity

### Code Features

- **Auto-completion**: TypeScript and Tailwind CSS
- **Format on save**: Code automatically formats
- **Error checking**: Real-time TypeScript errors
- **Import suggestions**: Automatic import management

## 🐛 Troubleshooting Windows Issues

### ESM URL Scheme Error
If you see: `Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]`

**Solution**: Use the Windows-specific startup methods above

### PowerShell Execution Policy
If PowerShell blocks scripts:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Port Already in Use
If port 5000 is busy:
```bash
# Find what's using the port
netstat -ano | findstr :5000

# Kill the process (replace PID with actual number)
taskkill /PID <PID> /F
```

### Node.js Path Issues
If Node.js commands don't work:
1. **Restart VS Code** after installing Node.js
2. **Check Node.js installation**:
   ```bash
   node --version
   npm --version
   ```

## 📱 Testing Your Setup

### Quick Health Check
1. **Open new terminal** in VS Code
2. **Test server**:
   ```bash
   curl http://localhost:5000/api/health
   ```
3. **Should return**: `{"status":"ok"}`

### API Testing with Thunder Client
1. **Install Thunder Client** extension
2. **Create new request**:
   - Method: GET
   - URL: `http://localhost:5000/api/exercises`
3. **Send request** - should return exercise data

### Database Check
1. **Run task**: "Open Database Studio"
2. **Access**: http://localhost:4983
3. **Browse tables** visually

## ⌨️ Useful VS Code Shortcuts

- **New Terminal**: `Ctrl+Shift+``
- **Command Palette**: `Ctrl+Shift+P`
- **Quick Open**: `Ctrl+P`
- **Start Debugging**: `F5`
- **Toggle Sidebar**: `Ctrl+B`
- **Split Editor**: `Ctrl+\`
- **Go to Line**: `Ctrl+G`

## 🎯 Development Workflow

1. **Make code changes** in VS Code
2. **Save files** (auto-format happens)
3. **Server restarts automatically**
4. **Browser refreshes** (with hot reload)
5. **Test changes** immediately

## 📂 Project Structure

```
sportzal-fitness/
├── .vscode/          # VS Code configuration
├── client/           # React frontend
├── server/           # Express backend
├── shared/           # Shared types
├── scripts/          # Utility scripts
├── start-dev.bat     # Windows startup script
├── run-windows.js    # Alternative startup
└── .env             # Your environment variables
```

## ✅ Success Indicators

Your setup is working when:
- ✅ VS Code opens without errors
- ✅ Extensions are installed
- ✅ Terminal commands work
- ✅ Server starts without ESM errors
- ✅ Browser shows the application
- ✅ You can login with admin credentials
- ✅ No console errors in browser (F12)

## 🆘 Still Having Issues?

1. **Check TROUBLESHOOTING.md** for specific error solutions
2. **Restart VS Code** completely
3. **Try different startup methods** in order
4. **Verify Node.js installation** and version
5. **Check Windows permissions** for the project folder

The application is designed to work perfectly on Windows with VS Code using these methods!