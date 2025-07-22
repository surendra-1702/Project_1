# Troubleshooting Guide for Sportzal Fitness

This guide helps you resolve common issues when setting up and running the project locally.

## 🚨 Common Setup Errors

### 1. OpenAI API Key Error

**Error Message:**
```
OpenAIError: The OPENAI_API_KEY environment variable is missing or empty
```

**Solution:**
This error is **FIXED** in the latest version. The issue was caused by the DeepSeek service trying to initialize OpenAI client unnecessarily.

✅ **Current Fix Applied:**
- DeepSeek service now only initializes when API key is available
- No OpenAI API key required for this project
- Fallback system works without any API keys

**Your .env file should only include:**
```env
DATABASE_URL="your-database-url"
JWT_SECRET="hhUuWsnzQgBZnNxSgtFw5zOI4KUm4ZrVhEuu6V1Rmw0="
NODE_ENV="development"

# Optional - DeepSeek API for enhanced workout plans
DEEPSEEK_API_KEY="sk-your-deepseek-api-key-here"
```

### 2. Database Connection Errors

**Error:** `Connection refused` or `ECONNREFUSED`

**Solutions:**
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL (macOS with Homebrew)
brew services start postgresql

# Start PostgreSQL (Linux)
sudo systemctl start postgresql

# For Docker users
docker run --name sportzal-postgres \
  -e POSTGRES_DB=sportzal_fitness \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 -d postgres:15
```

**Database URL Format Examples:**
```env
# Local PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/sportzal_fitness"

# Neon Database
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Docker PostgreSQL
DATABASE_URL="postgresql://postgres:password@localhost:5432/sportzal_fitness"
```

### 3. JWT Secret Missing

**Error:** `JWT_SECRET must be set`

**Solution:**
Use this secure JWT secret in your `.env` file:
```env
JWT_SECRET="hhUuWsnzQgBZnNxSgtFw5zOI4KUm4ZrVhEuu6V1Rmw0="
```

Or generate your own:
```bash
openssl rand -base64 32
```

### 4. Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solutions:**
```bash
# Find what's using port 5000
lsof -i :5000

# Kill the process (replace PID with actual process ID)
kill -9 <PID>

# Or use a different port
PORT=3000 npm run dev
```

### 5. Module Not Found Errors

**Error:** `Cannot find module` or import errors

**Solutions:**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear npm cache
npm cache clean --force

# Ensure you're using Node.js 18+
node --version
```

### 6. Database Tables Missing

**Error:** `relation "users" does not exist`

**Solution:**
```bash
# Create database tables
npm run db:push

# If that fails, check your database connection first
node scripts/setup-database.js
```

### 7. TypeScript Compilation Errors

**Error:** TypeScript compilation failures

**Solutions:**
```bash
# Run type checker
npm run check

# Restart TypeScript server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"

# Clear TypeScript cache
rm -rf .tsbuildinfo
```

## 🔧 Environment-Specific Issues

### Windows Users

**ESM URL Scheme Error:**
```
Error [ERR_UNSUPPORTED_ESM_URL_SCHEME]: Only URLs with a scheme in: file, data, and node are supported
```

**Solutions (Try in order):**
```bash
# Option 1: Simple Windows batch file (BEST for ESM issues)
run-simple.bat

# Option 2: Windows CommonJS entry point
node server/index-windows.js

# Option 3: Use ts-node instead of tsx
npx ts-node server/index.ts

# Option 4: Enhanced Windows batch file
start-dev.bat

# Option 5: Build and run production version
npm run build && npm start

# Option 6: Use cross-env
npx cross-env NODE_ENV=development tsx server/index.ts
```

**PowerShell Execution Policy Issues:**
```powershell
# If PowerShell blocks the script, run this first:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Then run the script:
./start-windows.ps1
```

**PostgreSQL Connection:**
```env
# Windows PostgreSQL URL format
DATABASE_URL="postgresql://postgres:password@localhost:5432/sportzal_fitness"
```

### macOS Users

**Permission Errors:**
```bash
# Fix permissions
sudo chown -R $(whoami) ~/.npm

# Use Homebrew for PostgreSQL
brew install postgresql@15
brew services start postgresql@15
```

### Linux Users

**PostgreSQL Installation:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Create database user
sudo -u postgres createuser --interactive
sudo -u postgres createdb sportzal_fitness
```

## 🧪 Testing Your Setup

### 1. Basic Connection Test
```bash
# Test database connection
node -e "
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(r => console.log('✅ DB connected:', r.rows[0])).catch(e => console.error('❌ DB error:', e.message));
"
```

### 2. API Endpoint Tests
```bash
# Start the server first
npm run dev

# In another terminal, test endpoints
curl http://localhost:5000/api/health
curl http://localhost:5000/api/exercises
```

### 3. Authentication Test
```bash
# Test user registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "age": 25,
    "height": 175,
    "weight": 70,
    "gender": "male",
    "fitnessGoal": "muscle gain",
    "activityLevel": "moderate"
  }'
```

## 📱 Frontend Issues

### React Component Errors

**Error:** Component won't render or shows errors

**Check:**
1. Browser console for JavaScript errors
2. Network tab for failed API calls
3. React Developer Tools for component state

### Styling Issues

**Problem:** Styles not loading properly

**Solutions:**
```bash
# Rebuild Tailwind CSS
npm run build

# Clear browser cache
# Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
```

## 🔍 Debugging Steps

### 1. Check Console Logs
```bash
# Server logs
npm run dev
# Look for error messages in terminal

# Browser logs
# Open Developer Tools (F12)
# Check Console tab for errors
```

### 2. Database GUI
```bash
# Open Drizzle Studio for database inspection
npm run db:studio
```

### 3. API Testing
```bash
# Test API endpoints with curl
curl -X GET http://localhost:5000/api/health
curl -X GET http://localhost:5000/api/exercises
```

## 🆘 Get Help

If you're still having issues:

1. **Check the error message carefully** - most errors give specific clues
2. **Verify environment variables** - ensure all required variables are set
3. **Test database connection** - many issues stem from database problems
4. **Check port conflicts** - ensure port 5000 is available
5. **Review logs** - server and browser console logs show detailed errors

## ✅ Success Indicators

Your setup is working when:
- ✅ Server starts without errors
- ✅ Frontend loads at http://localhost:5000
- ✅ Health check returns: `{"status":"ok"}`
- ✅ Can login with admin credentials
- ✅ No console errors in browser
- ✅ Database operations succeed

**Note:** The application is designed to work perfectly with just the database and JWT secret. API keys are optional and the system has robust fallback mechanisms.