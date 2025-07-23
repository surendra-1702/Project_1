# Sportzal Fitness - Full-Stack Fitness Application

A comprehensive fitness platform built with React, Express.js, and PostgreSQL featuring AI-powered workout planning, exercise demonstrations, calorie tracking, and user management.

## 🚀 Features

- **User Authentication**: JWT-based secure authentication system
- **AI Workout Planner**: DeepSeek R1 integration with intelligent fallback system
- **Exercise Library**: 11 muscle group categories with local GIF demonstrations
- **Calorie Tracker**: Daily food entry and macro tracking
- **BMI Calculator**: Comprehensive health metrics with TDEE calculations
- **Admin Dashboard**: User management and system monitoring
- **Responsive Design**: Mobile-first design with dark/light theme support

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS, shadcn/ui
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: JWT with bcrypt password hashing
- **State Management**: TanStack Query
- **UI Components**: Radix UI primitives

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- Git

## 🔧 Local Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd sportzal-fitness
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Option A: Local PostgreSQL
1. Install PostgreSQL on your system
2. Create a new database:
```sql
CREATE DATABASE sportzal_fitness;
```

#### Option B: Neon Database (Recommended)
1. Sign up at [Neon](https://neon.tech)
2. Create a new project
3. Copy the connection string

### 4. Environment Configuration

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/sportzal_fitness"
# Or for Neon: DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Authentication
JWT_SECRET="your-super-secret-jwt-key-here-min-32-chars"

# AI Services (Optional - fallback system works without this)
DEEPSEEK_API_KEY="sk-your-deepseek-api-key-here"

# Development
NODE_ENV="development"
```

### 5. Database Migration

```bash
npm run db:push
```

### 6. Start the Application

**Linux/macOS:**
```bash
npm run dev
```

**Windows:**
```cmd
npx cross-env NODE_ENV=development tsx server/index.ts
```

The application will be available at:
- Frontend: http://localhost:5000
- Backend API: http://localhost:5000/api

## 🗄 Database Schema

The application automatically creates the following tables:
- `users` - User accounts and profiles
- `workout_plans` - AI-generated and custom workout plans
- `workout_sessions` - Completed workout tracking
- `food_entries` - Daily calorie and nutrition tracking
- `weight_entries` - Weight tracking over time
- `sessions` - User session management

## 🎯 Default Admin Account

A default admin account is created automatically:
- **Email**: admin@sportzalfitness.com
- **Password**: admin123
- **Role**: admin

⚠️ **Important**: Change the admin password immediately in production!

## 🔑 API Keys Setup

### DeepSeek API (Optional)
1. Visit [DeepSeek Platform](https://platform.deepseek.com/api_keys)
2. Create a new API key
3. Add to your `.env` file as `DEEPSEEK_API_KEY`

**Note**: The system includes an intelligent fallback that generates quality workout plans even without a valid API key.

## 📁 Project Structure

```
sportzal-fitness/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/         # Application pages
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utilities and configurations
├── server/                # Express.js backend
│   ├── services/          # Business logic services
│   ├── auth.ts           # Authentication middleware
│   ├── db.ts             # Database connection
│   ├── routes.ts         # API routes
│   └── storage.ts        # Data access layer
├── shared/               # Shared types and schemas
├── public/              # Static assets and exercise GIFs
└── attached_assets/     # Additional assets
```

## 🏃‍♂️ Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
```

## 🔒 Security Features

- JWT token authentication
- bcrypt password hashing
- Environment variable protection
- SQL injection prevention via Drizzle ORM
- XSS protection via React
- CORS configuration

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV="production"
DATABASE_URL="your-production-database-url"
JWT_SECRET="your-production-jwt-secret"
DEEPSEEK_API_KEY="your-deepseek-api-key"
```

### Build and Deploy
```bash
npm run build
# Deploy the built files to your hosting platform
```

## 🛠 Troubleshooting

### Database Connection Issues
- Verify PostgreSQL is running
- Check DATABASE_URL format
- Ensure database exists and is accessible

### Authentication Problems
- Verify JWT_SECRET is set and secure
- Check token expiration settings
- Ensure bcrypt is properly installed

### API Issues
- DeepSeek API key is optional - fallback system provides workout plans
- Check environment variables are loaded
- Verify network connectivity for external APIs

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📧 Support

For issues and questions, please create an issue in the GitHub repository.