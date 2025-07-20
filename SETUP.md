# Local Development Setup Guide

This guide will walk you through setting up Sportzal Fitness on your local machine.

## Prerequisites Checklist

- [ ] Node.js 18+ installed
- [ ] PostgreSQL 12+ installed
- [ ] Git installed
- [ ] Code editor (VS Code recommended)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd sportzal-fitness

# Install dependencies
npm install
```

### 2. Database Setup (Choose One)

#### Option A: Local PostgreSQL Setup

1. **Install PostgreSQL** (if not already installed):
   - **Windows**: Download from [postgresql.org](https://www.postgresql.org/download/windows/)
   - **macOS**: `brew install postgresql@15`
   - **Ubuntu/Debian**: `sudo apt install postgresql postgresql-contrib`

2. **Start PostgreSQL service**:
   - **Windows**: Use pgAdmin or services panel
   - **macOS**: `brew services start postgresql@15`
   - **Linux**: `sudo systemctl start postgresql`

3. **Create database**:
```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sportzal_fitness;

# Create user (optional)
CREATE USER sportzal_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE sportzal_fitness TO sportzal_user;

# Exit
\q
```

#### Option B: Neon Database (Cloud PostgreSQL)

1. Sign up at [Neon.tech](https://neon.tech)
2. Create a new project named "sportzal-fitness"
3. Copy the connection string from the dashboard

### 3. Environment Configuration

1. **Copy the example environment file**:
```bash
cp .env.example .env
```

2. **Edit `.env` with your configuration**:

For **Local PostgreSQL**:
```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sportzal_fitness"
PGHOST="localhost"
PGPORT="5432"
PGUSER="postgres"
PGPASSWORD="your_password"
PGDATABASE="sportzal_fitness"
JWT_SECRET="your-very-secure-jwt-secret-minimum-32-characters-long"
NODE_ENV="development"
```

For **Neon Database**:
```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/sportzal_fitness?sslmode=require"
JWT_SECRET="your-very-secure-jwt-secret-minimum-32-characters-long"
NODE_ENV="development"
```

### 4. Database Schema Setup

```bash
# Push schema to database
npm run db:push

# Verify tables were created
npm run db:studio
```

This will:
- Create all required tables
- Set up indexes and relationships
- Insert initial admin user

### 5. Start Development Server

```bash
npm run dev
```

The application will start at http://localhost:5000

## Verification Steps

### 1. Test Database Connection
```bash
# Should show database info without errors
node -e "
const { Pool } = require('@neondatabase/serverless');
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
pool.query('SELECT NOW()').then(r => console.log('✅ Database connected:', r.rows[0])).catch(e => console.error('❌ Database error:', e.message));
"
```

### 2. Test API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Register test user
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

### 3. Test Frontend
- Visit http://localhost:5000
- You should see the landing page
- Try logging in with admin credentials:
  - Email: admin@sportzalfitness.com
  - Password: admin123

## Common Issues and Solutions

### Database Connection Errors

**Error**: `Connection refused` or `ECONNREFUSED`
- **Solution**: Ensure PostgreSQL is running and the port (5432) is correct

**Error**: `password authentication failed`
- **Solution**: Check username/password in DATABASE_URL

**Error**: `database does not exist`
- **Solution**: Create the database manually: `createdb sportzal_fitness`

### Environment Variable Issues

**Error**: `JWT_SECRET must be set`
- **Solution**: Ensure `.env` file exists and JWT_SECRET is set

**Error**: `Cannot find module` or import errors
- **Solution**: Run `npm install` again

### Port Conflicts

**Error**: `EADDRINUSE` or port already in use
- **Solution**: Kill processes using port 5000 or change the port

```bash
# Find process using port 5000
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>
```

### Exercise GIFs Not Loading

**Error**: GIF files not displaying
- **Solution**: Ensure `public/exercises/` directory exists with GIF files
- The system expects organized folders by muscle group

## Development Tools

### Database Management
```bash
# Open Drizzle Studio (database GUI)
npm run db:studio

# Generate new migration
npm run db:generate

# Apply migrations
npm run db:push
```

### Code Quality
```bash
# Run TypeScript checks
npx tsc --noEmit

# Format code (if prettier is configured)
npx prettier --write .
```

## Production Deployment Checklist

- [ ] Change default admin password
- [ ] Set secure JWT_SECRET (32+ characters)
- [ ] Use production database
- [ ] Set NODE_ENV="production"
- [ ] Configure CORS for your domain
- [ ] Set up HTTPS
- [ ] Configure proper logging
- [ ] Set up database backups

## Need Help?

1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure PostgreSQL is running and accessible
4. Try restarting the development server
5. Check the GitHub issues for similar problems

## Next Steps

Once everything is working:
1. Explore the admin dashboard
2. Create workout plans with the AI planner
3. Test the exercise library
4. Try the calorie tracking features
5. Customize the application for your needs