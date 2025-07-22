# Quick Start Guide - Sportzal Fitness

## 🚀 Get Running in 5 Minutes

### Step 1: Download the Project
```bash
git clone <your-repository-url>
cd sportzal-fitness
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Setup Environment
```bash
# Copy the example environment file
cp .env.example .env
```

**Your `.env` file is already configured with:**
- ✅ **JWT_SECRET**: `P8xQ2mR7vK9nL4sF6tH8jW3pE5yU1iO0aS2dG7kM9bN6cV4xZ8qT3wR5eY7uI1oP`
- ⚠️ **DATABASE_URL**: You need to add your database connection

### Step 4: Database Setup (Choose Option A or B)

#### Option A: Neon Database (Recommended - Free)
1. Go to [neon.tech](https://neon.tech) and sign up
2. Create a new project called "sportzal-fitness"
3. Copy the connection string from the dashboard
4. Replace in your `.env` file:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

#### Option B: Local PostgreSQL
1. Install PostgreSQL on your computer
2. Create a database:
```bash
createdb sportzal_fitness
```
3. Add to your `.env` file:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sportzal_fitness"
```

### Step 5: Initialize Database
```bash
npm run db:push
```

### Step 6: Start the Application
```bash
npm run dev
```

### Step 7: Open and Login
- **URL**: http://localhost:5000
- **Admin Email**: admin@sportzalfitness.com
- **Admin Password**: admin123

## ✅ You're Done!

The application includes:
- User authentication system
- AI-powered workout planner (with smart fallback)
- Exercise library with GIF demonstrations
- Calorie tracking system
- BMI calculator
- Admin dashboard

## 🔧 Need Help?

### Common Issues:

**Database connection fails?**
- Check your DATABASE_URL format
- Ensure PostgreSQL is running (if using local)

**Port 5000 already in use?**
```bash
# Find what's using the port
lsof -i :5000
# Kill it or use different port
PORT=3000 npm run dev
```

**Missing dependencies?**
```bash
rm -rf node_modules
npm install
```

### Test Your Setup:
```bash
# Check if everything is working
curl http://localhost:5000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2025-07-20T...",
  "version": "1.0.0",
  "services": {
    "database": "connected",
    "deepseek": "fallback mode"
  }
}
```

## 🎯 Next Steps

1. **Change admin password** in the user settings
2. **Try the AI workout planner** - it works even without API keys
3. **Browse the exercise library** - organized by muscle groups
4. **Track your calories** - comprehensive food logging
5. **Explore the admin dashboard** - user management features

## 📚 Additional Resources

- `README.md` - Complete project documentation
- `SETUP.md` - Detailed setup instructions
- `LOCAL_DEVELOPMENT.md` - Development guidelines
- `DEPLOYMENT_CHECKLIST.md` - Pre-deployment validation

Happy training! 💪