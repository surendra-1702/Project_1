# How to Run start-dev.bat

## 🚀 Method 1: VS Code Terminal (Recommended)

1. **Open VS Code** in your project folder
2. **Open Terminal**: Press `Ctrl+`` (backtick key)
3. **Type and press Enter**:
   ```
   start-dev.bat
   ```

## 🖱️ Method 2: Double-Click (Easiest)

1. **Open File Explorer** to your project folder
2. **Find the file**: `start-dev.bat`
3. **Double-click** the file
4. A command window will open and run the server

## 💻 Method 3: Command Prompt

1. **Open Command Prompt**:
   - Press `Windows + R`
   - Type `cmd` and press Enter
2. **Navigate to your project**:
   ```
   cd "C:\path\to\your\project"
   ```
3. **Run the batch file**:
   ```
   start-dev.bat
   ```

## 🛠️ Method 4: PowerShell

1. **Open PowerShell**:
   - Press `Windows + X`
   - Select "Windows PowerShell"
2. **Navigate to project**:
   ```
   cd "C:\path\to\your\project"
   ```
3. **Run the file**:
   ```
   .\start-dev.bat
   ```

## 📂 Where is start-dev.bat?

The file is located in your **project root directory**, same level as:
- package.json
- .env
- README.md

## ✅ What Happens When You Run It?

The batch file will:
1. Check Node.js installation
2. Install dependencies if needed
3. Kill any process using port 5000
4. Start the development server
5. Show server URL: http://localhost:5000

## 🆘 If It Doesn't Work

Try these alternatives in VS Code terminal:
```bash
# Alternative 1
npx cross-env NODE_ENV=development tsx server/index.ts

# Alternative 2  
node run-windows.js

# Alternative 3
node scripts/kill-port.js && npx tsx server/index.ts
```