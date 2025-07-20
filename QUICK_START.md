# Sportzal Fitness - Quick Start Guide

Get up and running with Sportzal Fitness in 5 minutes!

## 🚀 One-Command Setup

```bash
git clone <your-repo-url> && cd sportzal-fitness && npm install
```

## ⚡ Fastest Setup (Cloud Database)

1. **Get a free database** at [Neon.tech](https://neon.tech)
2. **Configure environment**:
```bash
cp .env.example .env
# Edit .env and add your database URL and JWT secret
```

3. **Initialize and start**:
```bash
npm run db:push && npm run dev
```

4. **Access the app**: http://localhost:5000
5. **Login**: admin@sportzalfitness.com / admin123

## 📋 Minimal .env Configuration

```env
DATABASE_URL="postgresql://username:password@host/database"
JWT_SECRET="generate-with-openssl-rand-base64-32"
```

## ✅ Verify It's Working

The app is ready when you see:
- ✅ Frontend loads at http://localhost:5000
- ✅ Health check: `curl http://localhost:5000/api/health`
- ✅ Can login with admin credentials
- ✅ No console errors

## 🎯 What You Get

- **AI Workout Planner**: Creates personalized workout plans
- **Exercise Library**: 11 muscle groups with GIF demonstrations  
- **Calorie Tracker**: Daily food logging and macro tracking
- **BMI Calculator**: Health metrics and TDEE calculations
- **Admin Dashboard**: User management and system monitoring
- **Responsive Design**: Works on mobile and desktop

## 🛠 Optional Enhancements

Add DeepSeek API key for enhanced AI workout generation:
```env
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"
```
*Note: System works perfectly with built-in fallback generator*

## 📚 Full Documentation

- **README.md**: Complete setup instructions
- **SETUP.md**: Detailed local development guide  
- **LOCAL_DEVELOPMENT.md**: Advanced development workflow
- **DEPLOYMENT_CHECKLIST.md**: Pre-deployment validation

## 🆘 Need Help?

**Database issues**: Check DATABASE_URL format
**Port conflicts**: Use `PORT=3000 npm run dev`
**Permission errors**: Ensure Node.js 18+ installed

That's it! You're ready to build the ultimate fitness platform! 💪