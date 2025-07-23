# Sportzal Fitness - Full-Stack Fitness Application

## Overview

Sportzal Fitness is a comprehensive full-stack fitness platform built with React, Express.js, and PostgreSQL. The application provides users with exercise demonstrations, BMI calculations, AI-powered workout planning, and calorie tracking capabilities. The system integrates with external APIs for exercise data and uses AI services for personalized workout recommendations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints with JSON responses
- **Middleware**: Custom logging, authentication (JWT), and error handling
- **Session Management**: JWT-based authentication with bcrypt for password hashing

### Database Architecture
- **Database**: PostgreSQL with Drizzle ORM
- **Migration Tool**: Drizzle Kit for schema management
- **Connection**: Neon Database (serverless PostgreSQL)
- **Schema Design**: Relational tables for users, exercises, workout plans, sessions, food entries, and blogs

## Key Components

### Authentication System
- JWT-based authentication with secure token management
- User registration with profile information (age, height, weight, fitness goals)
- Password hashing using bcrypt
- Protected routes with middleware authentication

### Exercise Management
- Local exercise GIF system with organized muscle group folders
- 11 muscle group categories: chest, back, shoulders, traps, legs, abs, biceps, triceps, arms, cardio, forearms
- Local exercise data stored in PostgreSQL without external API dependencies
- Direct GIF file access through organized folder structure

### AI-Powered Workout Planning
- DeepSeek R1 integration for personalized workout plan generation
- User profile-based recommendations (BMI, fitness goals, experience level)
- Structured workout plans with exercises, sets, reps, and progression notes
- Active workout plan management and tracking

### Calorie Tracking
- Daily food entry system with macro tracking (protein, carbs, fat)
- Date-based calorie goal management
- Progress visualization with charts and progress bars
- Meal categorization (breakfast, lunch, dinner, snacks)



### BMI Calculator
- Comprehensive BMI calculation with health category classification
- BMR (Basal Metabolic Rate) and TDEE (Total Daily Energy Expenditure) calculations
- Personalized calorie recommendations for different fitness goals
- Activity level consideration for accurate metabolic calculations

## Data Flow

### Client-Server Communication
1. Frontend makes API requests using TanStack Query
2. Express.js server handles routing and business logic
3. Authentication middleware validates JWT tokens
4. Database operations performed through Drizzle ORM
5. Optional external API calls to DeepSeek for enhanced workout planning
6. JSON responses returned to client with proper error handling

### External API Integration
- **DeepSeek API**: AI-powered workout plan generation (optional)
- **Neon Database**: Serverless PostgreSQL hosting
- **Local GIF System**: Exercise demonstrations from organized folder structure

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Backend**: Express.js, bcrypt, jsonwebtoken
- **Database**: Drizzle ORM, @neondatabase/serverless
- **External APIs**: axios for HTTP requests
- **Development**: TypeScript, Vite, tsx for development server

### Configuration Required
- `DATABASE_URL`: PostgreSQL connection string (required)
- `JWT_SECRET`: For JWT token signing (required)
- `DEEPSEEK_API_KEY`: For AI workout plan generation (optional - fallback system available)

## Deployment Strategy

### Development Environment
- Vite development server with HMR (Hot Module Replacement)
- Express.js server with tsx for TypeScript execution
- Environment variables loaded from `.env` file
- Database migrations handled by Drizzle Kit

### Production Build
- Frontend: Vite build process generating optimized static assets
- Backend: esbuild compilation to ES modules for Node.js
- Database: PostgreSQL schema deployment via Drizzle migrations
- Environment: Production environment variables for API keys and secrets

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (Neon Database recommended)
- Static file serving for frontend assets
- Environment variable support for configuration

## Changelog
- July 23, 2025. **Removed all external API dependencies** - Eliminated unnecessary API requirements, system now works entirely with optional DeepSeek R1 and intelligent fallback system for Windows compatibility
- July 20, 2025. **Final deployment preparation completed** - Created comprehensive local setup documentation (README.md, SETUP.md, LOCAL_DEVELOPMENT.md, QUICK_START.md, DEPLOYMENT_CHECKLIST.md), database initialization scripts, validation tools, health check endpoints, and provided secure JWT secret key for immediate local deployment
- July 20, 2025. **DeepSeek R1 integration with intelligent fallback system** - Successfully integrated DeepSeek R1 with robust error handling and local workout plan generation when API fails
- July 20, 2025. Prepared complete local development setup with comprehensive documentation, validation scripts, and deployment checklist - project is now ready for GitHub distribution and local development
- July 19, 2025. Integrated DeepSeek R1 model for AI-powered workout plan generation with intelligent fallback system
- July 19, 2025. Removed upper-back, lower-back, and calves muscle group categories - reduced from 14 to 11 organized muscle group folders for simplified exercise organization
- July 16, 2025. Removed external exercise API dependencies and implemented local exercise GIF system with organized muscle group folders - system now uses local GIF files with dedicated API endpoints
- July 16, 2025. Fixed critical MemStorage ID type consistency issues - updated all MemStorage methods to use string IDs matching database schema, resolved local development registration failures
- July 14, 2025. Updated application branding from "FitTrack Pro" to "Sportzal Fitness" across all user-facing interfaces, components, and documentation
- July 14, 2025. Fixed critical database schema mismatch issue - migrated from integer to string user IDs across all tables, implemented automatic ID generation for user registration, and resolved signup/authentication errors
- July 12, 2025. Added comprehensive role-based authentication system with admin dashboard for user monitoring and fitness goal tracking
- July 12, 2025. Completely removed blog feature from the application (routes, components, database schema, and storage)
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.