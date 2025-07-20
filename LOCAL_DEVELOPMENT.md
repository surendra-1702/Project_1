# Local Development Guide for Sportzal Fitness

This guide helps you set up and run Sportzal Fitness on your local machine.

## Quick Start

```bash
# 1. Clone the repository
git clone <repository-url>
cd sportzal-fitness

# 2. Install dependencies
npm install

# 3. Copy environment template
cp .env.example .env

# 4. Edit .env with your database credentials
# (See Database Setup section below)

# 5. Set up the database
npm run db:push

# 6. Start the development server
npm run dev
```

## Prerequisites

- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org/)
- **PostgreSQL 12+**: One of the following options:
  - Local PostgreSQL installation
  - [Neon Database](https://neon.tech) (recommended)
  - [Supabase](https://supabase.com) 
  - Any PostgreSQL cloud provider

## Database Setup Options

### Option 1: Neon Database (Recommended)

1. Sign up at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Add to your `.env` file:

```env
DATABASE_URL="postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require"
```

### Option 2: Local PostgreSQL

1. Install PostgreSQL on your system
2. Create a database:

```sql
createdb sportzal_fitness
```

3. Add to your `.env` file:

```env
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/sportzal_fitness"
```

### Option 3: Docker PostgreSQL

```bash
# Run PostgreSQL in Docker
docker run --name sportzal-postgres \
  -e POSTGRES_DB=sportzal_fitness \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Add to .env
DATABASE_URL="postgresql://postgres:password@localhost:5432/sportzal_fitness"
```

## Environment Configuration

Edit your `.env` file with these values:

```env
# Database (required)
DATABASE_URL="your-database-connection-string"

# Authentication (required)
JWT_SECRET="your-secure-jwt-secret-at-least-32-characters-long"

# AI Services (optional)
DEEPSEEK_API_KEY="sk-your-deepseek-api-key"

# Development
NODE_ENV="development"
```

**Important**: 
- Generate a secure JWT_SECRET (use: `openssl rand -base64 32`)
- DeepSeek API key is optional - the system has a fallback workout generator

## Available Commands

```bash
# Development
npm run dev              # Start development server
npm run check           # TypeScript type checking

# Database
npm run db:push         # Apply schema changes
npm run db:studio       # Open database GUI
npm run db:generate     # Generate migrations

# Utilities
node scripts/setup-database.js    # Initialize database with admin user
node scripts/validate-setup.js    # Validate your setup
node scripts/check-health.js      # Check if app is running correctly

# Production
npm run build           # Build for production
npm run start           # Start production server
```

## Verification Steps

### 1. Validate Your Setup
```bash
node scripts/validate-setup.js
```

This checks:
- Environment variables
- Database connection
- Required files and directories
- Dependencies
- Exercise assets

### 2. Test Database Connection
```bash
node scripts/setup-database.js
```

This will:
- Test database connectivity
- Create required tables
- Create default admin user

### 3. Health Check (after starting server)
```bash
# In another terminal, after npm run dev
node scripts/check-health.js
```

## Default Admin Account

The system automatically creates an admin account:
- **Email**: `admin@sportzalfitness.com`
- **Password**: `admin123`

🚨 **Change this password immediately in production!**

## Project Structure

```
sportzal-fitness/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom hooks
│   │   └── lib/           # Utilities
├── server/                # Express backend
│   ├── services/          # Business logic
│   ├── auth.ts           # Authentication
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API endpoints
│   └── storage.ts        # Data layer
├── shared/               # Shared types
├── public/              # Static assets
│   └── exercises/       # Exercise GIF files
└── scripts/             # Setup and utility scripts
```

## Development Workflow

1. **Start the development server**:
   ```bash
   npm run dev
   ```

2. **Access the application**:
   - Frontend: http://localhost:5000
   - API: http://localhost:5000/api

3. **Make changes**:
   - Frontend files auto-reload with Vite HMR
   - Backend files auto-reload with tsx

4. **Database changes**:
   ```bash
   # After modifying shared/schema.ts
   npm run db:push
   ```

## Common Issues and Solutions

### Database Connection Errors

**Problem**: `Connection refused` or `ECONNREFUSED`
```bash
# Check if PostgreSQL is running
pg_isready -h localhost -p 5432

# For Docker
docker ps | grep postgres
```

**Problem**: `password authentication failed`
- Verify username/password in DATABASE_URL
- Check PostgreSQL user permissions

### Environment Variable Issues

**Problem**: `JWT_SECRET must be set`
```bash
# Generate a secure secret
openssl rand -base64 32

# Add to .env file
JWT_SECRET="generated-secret-here"
```

### Port Conflicts

**Problem**: `EADDRINUSE` - port 5000 in use
```bash
# Find what's using the port
lsof -i :5000

# Kill the process (replace PID)
kill -9 <PID>

# Or use a different port
PORT=3000 npm run dev
```

### Exercise GIFs Not Loading

**Problem**: Exercise images not displaying
- Ensure `public/exercises/` directory exists
- Check that GIF files are organized by muscle group:
  ```
  public/exercises/
  ├── chest/
  ├── back/
  ├── shoulders/
  ├── legs/
  └── abs/
  ```

### TypeScript Errors

**Problem**: Type checking failures
```bash
# Run type checker
npm run check

# Common fix: restart TS server in VS Code
# Cmd/Ctrl + Shift + P -> "TypeScript: Restart TS Server"
```

## API Testing

Test API endpoints with curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Register user
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

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@sportzalfitness.com",
    "password": "admin123"
  }'
```

## Performance Tips

- Use `npm run db:studio` for visual database management
- Enable browser dev tools for React debugging
- Use React Developer Tools extension
- Monitor network tab for API call performance

## Getting Help

1. **Check the logs**: Look at terminal output for errors
2. **Validate setup**: Run `node scripts/validate-setup.js`
3. **Database issues**: Use `npm run db:studio` to inspect data
4. **API issues**: Test endpoints with curl or Postman
5. **Frontend issues**: Check browser console for errors

## Next Steps

Once everything is running:

1. **Explore the admin dashboard**: Login as admin and check user management
2. **Test the AI workout planner**: Create a personalized workout plan
3. **Try the exercise library**: Browse exercises by muscle group
4. **Use the calorie tracker**: Log food entries and track progress
5. **Customize the app**: Modify components and styling to your needs

## Contributing

If you want to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly with the validation scripts
5. Submit a pull request

Happy coding! 🏋️‍♂️