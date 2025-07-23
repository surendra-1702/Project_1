# Windows Setup Guide for Sportzal Fitness

## 🪟 Windows-Specific Instructions

### Step 1: Prerequisites
1. **Install Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
2. **Install Git**: Download from [git-scm.com](https://git-scm.com/)
3. **Choose Database Option**:
   - **Option A**: Neon Database (Recommended - Cloud, Free)
   - **Option B**: Local PostgreSQL (Download from [postgresql.org](https://www.postgresql.org/download/windows/))

### Step 2: Download Project
```cmd
git clone <your-repository-url>
cd sportzal-fitness
npm install
```

### Step 3: Setup Environment (Windows)
```cmd
# Copy the environment template
copy .env.example .env
```

### Step 4: Edit Environment File
Open `.env` in Notepad or your favorite editor and configure:

```env
# Database - Choose ONE option:

# Option A: Neon Database (Recommended)
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"

# Option B: Local PostgreSQL  
# DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sportzal_fitness"

# Authentication (Already configured)
JWT_SECRET="P8xQ2mR7vK9nL4sF6tH8jW3pE5yU1iO0aS2dG7kM9bN6cV4xZ8qT3wR5eY7uI1oP"

# Optional AI (system works without this)
# DEEPSEEK_API_KEY="sk-your-deepseek-api-key"

# Development
NODE_ENV=development
```

### Step 5: Database Setup

#### Option A: Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech)
2. Sign up and create new project "sportzal-fitness"
3. Copy the connection string
4. Paste it as DATABASE_URL in your `.env` file

#### Option B: Local PostgreSQL
1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. During installation, remember your postgres password
3. Open Command Prompt as Administrator:
```cmd
# Create database
createdb -U postgres sportzal_fitness
```
4. Update `.env` with your postgres password

### Step 6: Initialize Database
```cmd
npm run db:push
```

### Step 7: Start Application (Windows)
```cmd
# Use cross-env for Windows compatibility
npx cross-env NODE_ENV=development tsx server/index.ts
```

**Alternative method:**
```cmd
# Or use npm script
npm run dev
```

### Step 8: Access Application
- **URL**: http://localhost:5000
- **Admin Login**:
  - Email: `admin@sportzalfitness.com`
  - Password: `admin123`

## 🔧 Windows Troubleshooting

### Problem: NODE_ENV not recognized
**Error**: `'NODE_ENV' is not recognized as an internal or external command`

**Solution**: Use cross-env:
```cmd
npm install -g cross-env
npx cross-env NODE_ENV=development tsx server/index.ts
```

### Problem: Missing Environment Variables
**Error**: `DATABASE_URL not found, using MemStorage`

**Solution**: 
1. Ensure `.env` file exists in project root
2. Check DATABASE_URL is uncommented and properly formatted
3. Restart the application after editing `.env`

### Problem: Missing API Keys
**Error**: API key environment variables missing

**Solution**: The app works perfectly without external API keys using the intelligent fallback system for workout plan generation.

### Problem: Port 5000 in Use
**Error**: `EADDRINUSE` or port already in use

**Solution**:
```cmd
# Find what's using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID)
taskkill /PID <process-id> /F

# Or use different port
set PORT=3000 && npm run dev
```

### Problem: PostgreSQL Connection
**Error**: Connection refused or authentication failed

**Solutions**:
1. **Check PostgreSQL is running**:
   - Open Services (services.msc)
   - Look for "postgresql" service
   - Start if stopped

2. **Verify password**:
   - Use pgAdmin to test connection
   - Update password in DATABASE_URL

3. **Check firewall**:
   - Ensure port 5432 is open
   - Add PostgreSQL to Windows Firewall exceptions

## 🚀 Quick Test
After setup, test everything works:

```cmd
# Test API health
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "database": "connected",
  "deepseek": "fallback mode"
}
```

## 📱 Verify Features Work

1. **Frontend**: Visit http://localhost:5000
2. **Login**: Use admin@sportzalfitness.com / admin123  
3. **AI Workout Planner**: Create a workout plan (fallback system works without API keys)
4. **Exercise Library**: Browse exercises by muscle group
5. **Calorie Tracker**: Log food entries
6. **Admin Dashboard**: Access user management

## 💡 Windows Tips

- Use **PowerShell** or **Command Prompt** as Administrator for best results
- **Windows Defender** might flag Node.js - add exceptions if needed
- Use **Visual Studio Code** for editing - has great Windows integration
- **Git Bash** provides Unix-like commands if you prefer

## ✅ You're Ready!

Your Sportzal Fitness application is now running on Windows with:
- Full authentication system
- AI workout planner with smart fallback
- Exercise library with demonstrations
- Calorie tracking system  
- Admin dashboard
- Database persistence

The application works perfectly without external API keys thanks to the intelligent fallback system!