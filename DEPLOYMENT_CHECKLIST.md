# Deployment Checklist for Sportzal Fitness

This checklist ensures your local development setup is ready and complete.

## ✅ Pre-Deployment Checklist

### 1. Environment Setup
- [ ] Node.js 18+ installed
- [ ] PostgreSQL database accessible (local or cloud)
- [ ] `.env` file configured with all required variables
- [ ] Dependencies installed (`npm install`)

### 2. Database Configuration
- [ ] Database connection tested
- [ ] Schema deployed (`npm run db:push`)
- [ ] Admin user created
- [ ] All tables accessible

### 3. Application Testing
- [ ] Development server starts without errors
- [ ] Frontend loads at http://localhost:5000
- [ ] API health check passes
- [ ] Authentication system works
- [ ] Key features functional

### 4. Security Configuration
- [ ] Secure JWT_SECRET set (32+ characters)
- [ ] Default admin password changed
- [ ] Environment variables secured
- [ ] Sensitive data not in version control

## 🚀 Quick Validation Commands

Run these commands to validate your setup:

```bash
# 1. Validate overall setup
node scripts/validate-setup.js

# 2. Test database connection
node scripts/setup-database.js

# 3. Start the application
npm run dev

# 4. Test health endpoint (in another terminal)
curl http://localhost:5000/api/health
```

## 📋 Environment Variables Checklist

Required variables in your `.env` file:

```env
# ✅ Database (Required)
DATABASE_URL="postgresql://..."

# ✅ Authentication (Required)  
JWT_SECRET="your-secure-32-char-secret"

# ⚠️ AI Services (Optional - fallback works without)
DEEPSEEK_API_KEY="sk-your-api-key"

# ⚠️ Development (Optional)
NODE_ENV="development"
```

## 🏃‍♂️ First Run Instructions

1. **Clone and setup**:
```bash
git clone <repository-url>
cd sportzal-fitness
npm install
cp .env.example .env
```

2. **Configure database**:
   - Edit `.env` with your database URL
   - Generate JWT secret: `openssl rand -base64 32`

3. **Initialize database**:
```bash
npm run db:push
node scripts/setup-database.js
```

4. **Start application**:
```bash
npm run dev
```

5. **Test login**:
   - Visit: http://localhost:5000
   - Login: admin@sportzalfitness.com / admin123

## 🔧 Troubleshooting Common Issues

### Database Connection Issues
```bash
# Test PostgreSQL connection
pg_isready -h localhost -p 5432

# Check if tables exist
psql $DATABASE_URL -c "\dt"
```

### Port Conflicts
```bash
# Find what's using port 5000
lsof -i :5000

# Use different port
PORT=3000 npm run dev
```

### Missing Dependencies
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Permission Issues
```bash
# Fix file permissions
chmod +x scripts/*.js
```

## ✨ Feature Testing Checklist

After setup, test these core features:

### Authentication
- [ ] User registration works
- [ ] Login/logout functional
- [ ] JWT tokens issued correctly
- [ ] Protected routes secured

### AI Workout Planner
- [ ] Plan generation works (with API key or fallback)
- [ ] Plans save to database
- [ ] Plans display in user interface
- [ ] Multiple plans supported

### Exercise Library
- [ ] Exercise list loads
- [ ] GIF files display correctly
- [ ] Muscle group filtering works
- [ ] Search functionality active

### Calorie Tracker
- [ ] Food entries save
- [ ] Daily totals calculate correctly
- [ ] Progress tracking functional
- [ ] Date navigation works

### Admin Dashboard
- [ ] Admin user can access dashboard
- [ ] User management functional
- [ ] System stats display
- [ ] Role-based access enforced

## 📊 Performance Checklist

- [ ] Page load times under 3 seconds
- [ ] API responses under 1 second
- [ ] Database queries optimized
- [ ] No console errors in browser
- [ ] Mobile responsive design works

## 🔐 Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT tokens expire appropriately
- [ ] SQL injection prevented (using Drizzle ORM)
- [ ] XSS protection active
- [ ] Environment variables not exposed
- [ ] HTTPS in production (when deployed)

## 📱 Browser Compatibility

Test in these browsers:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (if on macOS)
- [ ] Edge (latest)
- [ ] Mobile browsers

## 🚀 Production Readiness

Before deploying to production:

- [ ] Change default admin password
- [ ] Set NODE_ENV="production"
- [ ] Use production database
- [ ] Configure proper CORS
- [ ] Set up SSL/HTTPS
- [ ] Enable logging
- [ ] Set up monitoring
- [ ] Configure backups

## 📞 Support Resources

If you encounter issues:

1. **Check the logs**: Look for error messages in terminal
2. **Validate setup**: Run `node scripts/validate-setup.js`
3. **Test endpoints**: Use curl or Postman for API testing
4. **Database GUI**: Use `npm run db:studio` to inspect data
5. **Documentation**: Review README.md and SETUP.md

## ✅ Final Verification

Your setup is complete when:

- ✅ All validation scripts pass
- ✅ Application starts without errors
- ✅ You can login as admin
- ✅ Core features work as expected
- ✅ No critical console errors
- ✅ Database operations succeed

**Congratulations! Your Sportzal Fitness application is ready to use! 🎉**