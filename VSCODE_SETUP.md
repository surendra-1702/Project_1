# VS Code Setup Guide for Sportzal Fitness

This guide shows you how to run and develop Sportzal Fitness efficiently in Visual Studio Code.

## 🚀 Quick Start in VS Code

### 1. Open the Project
```bash
cd sportzal-fitness
code .
```

### 2. Install Recommended Extensions
VS Code will prompt you to install recommended extensions. Click **"Install All"** or install manually:
- **TypeScript** - Enhanced TypeScript support
- **Tailwind CSS IntelliSense** - CSS class suggestions
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Thunder Client** - API testing (optional)
- **PostgreSQL** - Database management (optional)

### 3. Setup Environment
1. Copy `.env.example` to `.env`
2. Edit `.env` with your database URL and JWT secret:
```env
DATABASE_URL="your-database-url"
JWT_SECRET="hhUuWsnzQgBZnNxSgtFw5zOI4KUm4ZrVhEuu6V1Rmw0="
```

## 🎯 Running the Project

### Method 1: Using VS Code Tasks (Recommended)
1. **Open Command Palette**: `Ctrl+Shift+P` (Windows/Linux) or `Cmd+Shift+P` (Mac)
2. **Type**: "Tasks: Run Task"
3. **Select**: "Start Development Server"

### Method 2: Using the Integrated Terminal (Windows-Specific)
1. **Open Terminal**: `Ctrl+`` (backtick) or `Terminal > New Terminal`
2. **Run**:
```bash
# First time setup
npm install
npm run db:push

# Start the server (Windows methods)
start-dev.bat
# OR
npx cross-env NODE_ENV=development tsx server/index.ts
# OR
node run-windows.js
```

### Method 3: Using the Debug Panel
1. **Open Debug Panel**: `Ctrl+Shift+D`
2. **Select**: "Start Sportzal Fitness" from dropdown
3. **Click**: Green play button ▶️

## 🔧 Available VS Code Tasks

Access via `Ctrl+Shift+P` → "Tasks: Run Task":

- **Start Development Server** - Runs the full application
- **Setup Database** - Creates database tables
- **Initialize Database with Admin** - Adds admin user
- **Open Database Studio** - Visual database editor
- **Type Check** - TypeScript validation
- **Health Check** - Verify server is running

## 🐛 Debugging Features

### Debug Server Code
1. **Set breakpoints** in server files (click left margin)
2. **Start debugging**: `F5` or Debug panel
3. **Use "Debug Server Only"** configuration for server-only debugging

### Debug Frontend Code
1. **Start the server** first
2. **Open browser** to http://localhost:5000
3. **Use browser dev tools** (F12) for frontend debugging

## 📁 Project Structure in VS Code

```
sportzal-fitness/
├── 📂 .vscode/          # VS Code configuration
│   ├── launch.json      # Debug configurations
│   ├── tasks.json       # Custom tasks
│   ├── settings.json    # Workspace settings
│   └── extensions.json  # Recommended extensions
├── 📂 client/           # React frontend
├── 📂 server/           # Express backend
├── 📂 shared/           # Shared types/schemas
├── 📂 scripts/          # Utility scripts
└── 📄 .env              # Environment variables
```

## ⌨️ Useful Keyboard Shortcuts

- **Start Debugging**: `F5`
- **Open Terminal**: `Ctrl+``
- **Command Palette**: `Ctrl+Shift+P`
- **Quick Open File**: `Ctrl+P`
- **Go to Symbol**: `Ctrl+Shift+O`
- **Find in Files**: `Ctrl+Shift+F`
- **Toggle Sidebar**: `Ctrl+B`

## 🎨 Code Features

### IntelliSense & Auto-completion
- **TypeScript**: Full type checking and suggestions
- **Tailwind CSS**: Class name completions
- **Import suggestions**: Automatic import paths

### Code Formatting
- **Format on Save**: Enabled by default
- **Auto organize imports**: Keeps imports clean
- **Prettier integration**: Consistent code style

### Git Integration
- **Source Control panel**: `Ctrl+Shift+G`
- **View changes**: Side-by-side diff
- **Commit changes**: Built-in Git UI

## 🔍 Testing APIs in VS Code

### Using Thunder Client Extension
1. **Install Thunder Client** (recommended in extensions)
2. **Create new request**:
   - **GET**: `http://localhost:5000/api/health`
   - **POST**: `http://localhost:5000/api/auth/login`

### Sample API Tests
```json
// Login Test
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@sportzalfitness.com",
  "password": "admin123"
}
```

## 🗄️ Database Management

### Using PostgreSQL Extension
1. **Install PostgreSQL extension**
2. **Connect to database**: Use your DATABASE_URL
3. **Browse tables visually**
4. **Execute SQL queries**

### Using Drizzle Studio
1. **Run task**: "Open Database Studio"
2. **Access**: http://localhost:4983
3. **Visual interface** for database operations

## 🚨 Troubleshooting in VS Code

### TypeScript Errors
- **Restart TS Server**: `Ctrl+Shift+P` → "TypeScript: Restart TS Server"
- **Check problems panel**: `Ctrl+Shift+M`

### Server Won't Start
1. **Check terminal output** for error messages
2. **Verify .env file** exists and is configured
3. **Run health check task**

### Port Conflicts
- **Check if port 5000 is in use**
- **Kill existing processes** or use different port

## 💡 Pro Tips

1. **Split Editor**: `Ctrl+\` to view frontend and backend code simultaneously
2. **Breadcrumbs**: Navigate file structure easily
3. **Multi-cursor**: `Ctrl+Alt+Down` for multiple selections
4. **Peek Definition**: `Alt+F12` to view code without leaving current file
5. **Live Server**: Changes auto-reload in browser

## 🔄 Development Workflow

1. **Make changes** to code
2. **Save files** (auto-format happens)
3. **Server auto-restarts** (with tsx)
4. **Browser auto-refreshes** (with Vite HMR)
5. **Debug if needed** using breakpoints

## 📚 Additional Resources

- **VS Code TypeScript**: https://code.visualstudio.com/docs/languages/typescript
- **Debugging Node.js**: https://code.visualstudio.com/docs/nodejs/nodejs-debugging
- **Git in VS Code**: https://code.visualstudio.com/docs/sourcecontrol/overview

Your VS Code is now perfectly configured for Sportzal Fitness development!