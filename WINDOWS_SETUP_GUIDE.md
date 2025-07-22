# Complete Windows Setup Guide for Sportzal Fitness

Follow these steps exactly to run the project on your Windows computer.

## Step 1: Download and Extract Project

1. **Download** the project files to your computer
2. **Extract** to a folder like `C:\Users\YourName\Desktop\sportzal-fitness`
3. **Remember the folder path** - you'll need it

## Step 2: Install Required Software

### Install Node.js
1. Go to https://nodejs.org/
2. Download **LTS version** (recommended)
3. Run the installer with default settings
4. Restart your computer after installation

### Install VS Code (Optional but Recommended)
1. Go to https://code.visualstudio.com/
2. Download and install with default settings

## Step 3: Setup Database

You need a PostgreSQL database. Choose one option:

### Option A: Use Neon Database (Cloud - Easiest)
1. Go to https://neon.tech/
2. Sign up for free account
3. Create a new database
4. Copy the connection string (looks like: `postgresql://username:password@host/database`)

### Option B: Install PostgreSQL Locally
1. Go to https://www.postgresql.org/download/windows/
2. Download and install PostgreSQL
3. Remember the password you set
4. Your connection string will be: `postgresql://postgres:yourpassword@localhost:5432/sportzal_fitness`

## Step 4: Setup Environment File

1. **Open** your project folder in File Explorer
2. **Find** the file named `.env.example`
3. **Copy** this file and **rename** the copy to `.env`
4. **Right-click** the `.env` file and select "Open with Notepad"
5. **Replace** the content with:

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

6. **Replace** `your-database-connection-string-here` with your actual database URL
7. **Save** the file

## Step 5: Install Project Dependencies

### Method A: Using Command Prompt
1. **Press** `Windows + R`
2. **Type** `cmd` and press Enter
3. **Navigate** to your project folder:
   ```
   cd "C:\Users\YourName\Desktop\sportzal-fitness"
   ```
4. **Install** dependencies:
   ```
   npm install
   ```

### Method B: Using VS Code (Recommended)
1. **Open** VS Code
2. **File > Open Folder** and select your project folder
3. **Press** `Ctrl + `` (backtick) to open terminal
4. **Run**:
   ```
   npm install
   ```

## Step 6: Setup Database Tables

In the same terminal, run:
```
npm run db:push
```

## Step 7: Start the Application

Try these methods in order until one works:

### Method 1: Ultra Simple Batch File (Best for Windows)
1. **Double-click** `run-ultra-simple.bat` in your project folder
2. A command window will open and start the server

### Method 2: VS Code Terminal
1. **Open** VS Code with your project
2. **Press** `Ctrl + `` to open terminal
3. **Run**:
   ```
   run-ultra-simple.bat
   ```

### Method 3: Alternative Commands
If the batch file doesn't work, try these in VS Code terminal:
```bash
# Option A (CommonJS approach)
node server/index-windows.cjs

# Option B (ts-node approach)
npx ts-node server/index.ts

# Option C (build and run)
npm run build && npm start
```

## Step 8: Access the Application

1. **Open** your web browser
2. **Go to**: http://localhost:5000
3. **Login** with:
   - Email: `admin@sportzalfitness.com`
   - Password: `admin123`

## Troubleshooting Common Issues

### Issue: "Node.js not found"
**Solution**: Restart your computer after installing Node.js, then try again

### Issue: "Port 5000 already in use"
**Solution**: 
1. **Press** `Ctrl + Shift + Esc` to open Task Manager
2. **Find** any Node.js processes and end them
3. Try starting again

### Issue: "Database connection failed"
**Solution**: Check your `.env` file and make sure the DATABASE_URL is correct

### Issue: "ESM URL scheme error"
**Solution**: Use `run-simple.bat` instead of other methods - it's designed to fix this Windows issue

### Issue: "npm install fails"
**Solution**: 
1. **Delete** the `node_modules` folder
2. **Delete** `package-lock.json` file
3. **Run** `npm install` again

## Quick Commands Reference

### In Command Prompt or VS Code Terminal:
```bash
# Install dependencies
npm install

# Setup database
npm run db:push

# Start server (Windows-compatible)
run-simple.bat

# Alternative start methods
node server/index-windows.js
npx ts-node server/index.ts
start-dev.bat
```

## File Structure Check

Your project folder should contain:
- package.json
- .env (the file you created)
- run-simple.bat
- start-dev.bat
- server/ folder
- client/ folder
- node_modules/ folder (after npm install)

## Success Indicators

You know it's working when:
- Command window shows "serving on port 5000"
- Browser loads http://localhost:5000
- You can login with admin credentials
- No error messages in the command window

## Getting Help

If you're still having issues:
1. Check the error message in the command window
2. Make sure Node.js is installed correctly
3. Verify your database URL in .env file
4. Try the alternative start methods listed above

The `run-simple.bat` file is specifically designed to work on Windows and avoid common issues like the ESM URL scheme error.