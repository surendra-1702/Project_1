# Complete VS Code Setup Guide for Sportzal Fitness (Windows)

## Step 1: Install Required Software

### Install Node.js
1. Go to https://nodejs.org/
2. Download **LTS version** (Long Term Support)
3. Run installer with default settings
4. **Restart your computer** after installation

### Install VS Code
1. Go to https://code.visualstudio.com/
2. Download and install with default settings
3. Install recommended extensions (we'll set these up later)

## Step 2: Setup Your Project in VS Code

### Open Project in VS Code
1. **Launch VS Code**
2. **File → Open Folder**
3. **Navigate** to your project folder: `C:\Users\preet\Desktop\Project_1-main`
4. **Select Folder** to open the entire project

### Install VS Code Extensions
Press `Ctrl + Shift + X` to open Extensions, then install:
- **TypeScript and JavaScript Language Features** (usually pre-installed)
- **ES7+ React/Redux/React-Native snippets**
- **Tailwind CSS IntelliSense**
- **Auto Rename Tag**
- **Bracket Pair Colorizer**
- **GitLens**

## Step 3: Setup Environment File

### Create .env File
1. In VS Code, find `.env.example` in the file explorer
2. **Right-click** `.env.example` → **Copy**
3. **Right-click** in empty space → **Paste**
4. **Rename** the copy to `.env`
5. **Double-click** `.env` to open it
6. **Replace** the content with:

```
# Database (REQUIRED - replace with your database URL)
DATABASE_URL="postgresql://your-database-connection-string-here"

# Authentication (REQUIRED - use this exact value)
JWT_SECRET="hhUuWsnzQgBZnNxSgtFw5zOI4KUm4ZrVhEuu6V1Rmw0="

# Development
NODE_ENV="development"

# Optional - for AI workout features
DEEPSEEK_API_KEY="your-deepseek-key-here"
```

7. **Replace** `your-database-connection-string-here` with your actual database URL
8. **Save** the file (`Ctrl + S`)

## Step 4: Open VS Code Terminal

### Method 1: Keyboard Shortcut
Press `Ctrl + `` (backtick key, usually above Tab)

### Method 2: Menu
**Terminal → New Terminal**

### Method 3: Command Palette
1. Press `Ctrl + Shift + P`
2. Type "terminal"
3. Select "Terminal: Create New Terminal"

## Step 5: Install Dependencies

In the VS Code terminal, run:
```bash
npm install
```

Wait for it to complete (may take 2-3 minutes).

## Step 6: Setup Database

In the same terminal, run:
```bash
npm run db:push
```

## Step 7: Start the Application

### Method 1: Windows Alternative (Recommended)
```bash
run-windows-alternative.bat
```

### Method 2: Direct Command
```bash
npx ts-node server/index.ts
```

### Method 3: Simple Server Test
```bash
run-simple-server.bat
```

### Method 4: Built Version
```bash
npm run build
npm start
```

## Step 8: Access Your Application

1. **Wait** for the terminal to show "serving on port 5000"
2. **Open** your web browser
3. **Go to**: http://localhost:5000
4. **Login** with:
   - Email: `admin@sportzalfitness.com`
   - Password: `admin123`

## VS Code Tips for Development

### Useful Keyboard Shortcuts
- `Ctrl + `` - Toggle terminal
- `Ctrl + Shift + `` - New terminal
- `Ctrl + P` - Quick file search
- `Ctrl + Shift + P` - Command palette
- `Ctrl + /` - Comment/uncomment line
- `Ctrl + D` - Select next occurrence
- `F5` - Start debugging

### File Navigation
- **Explorer Panel** (left sidebar) shows all project files
- **Double-click** files to open them
- **Ctrl + Click** on imports to jump to files
- **Breadcrumbs** at top show current file location

### Terminal Management
- **Multiple terminals**: Click `+` next to terminal tab
- **Split terminal**: Click split icon in terminal
- **Kill terminal**: Click trash can icon
- **Clear terminal**: Type `cls` or `clear`

## Troubleshooting Common Issues

### "Node.js not found"
- **Restart VS Code** after installing Node.js
- **Restart your computer** if still not working

### "npm install fails"
1. **Delete** `node_modules` folder (if exists)
2. **Delete** `package-lock.json` file (if exists)
3. **Run**: `npm install` again

### "Port 5000 already in use"
1. **In terminal, run**: `netstat -ano | findstr :5000`
2. **Note the PID** (last column)
3. **Run**: `taskkill /PID [PID_NUMBER] /F`
4. **Try starting** again

### "Database connection failed"
- **Check** your `.env` file
- **Verify** DATABASE_URL is correct
- **Make sure** database is accessible

### "ES Module errors"
- **Use**: `run-windows-alternative.bat` (this fixes ES module issues)
- **Avoid**: using `tsx` directly on Windows

## Development Workflow

### Starting Development
1. **Open VS Code**
2. **Open** your project folder
3. **Press** `Ctrl + `` to open terminal
4. **Run**: `run-windows-alternative.bat`
5. **Open browser** to http://localhost:5000

### Making Changes
1. **Edit** files in VS Code
2. **Save** with `Ctrl + S`
3. **Server auto-restarts** (watch terminal for reload messages)
4. **Refresh browser** to see changes

### Stopping the Server
1. **In terminal**, press `Ctrl + C`
2. **Or** close the terminal tab

## VS Code Settings for This Project

### Recommended Settings (Optional)
1. **File → Preferences → Settings**
2. **Search** for each setting and update:
   - `editor.codeActionsOnSave` → Enable format on save
   - `editor.formatOnSave` → true
   - `typescript.preferences.importModuleSpecifier` → relative
   - `emmet.includeLanguages` → add "javascript": "javascriptreact"

### Workspace Settings
VS Code will automatically use the project's TypeScript configuration and recognize the file structure.

## Success Indicators

You know everything is working when:
- ✅ VS Code opens your project without errors
- ✅ Terminal shows "serving on port 5000"
- ✅ Browser loads http://localhost:5000
- ✅ You can login with admin credentials
- ✅ No error messages in VS Code terminal
- ✅ Files open without TypeScript errors

The `run-windows-alternative.bat` method is specifically designed to work around Windows ES module issues and should provide the most reliable startup experience in VS Code.