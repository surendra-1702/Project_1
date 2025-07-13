# FitTrack Pro - Full-Stack Fitness Application

## Overview

FitTrack Pro is a comprehensive full-stack fitness platform built with React, Express.js, and PostgreSQL. The application provides users with exercise demonstrations, BMI calculations, AI-powered workout planning, and calorie tracking capabilities. The system integrates with external APIs for exercise data and uses AI services for personalized workout recommendations.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state management
- **UI Components**: Radix UI primitives with shadcn/ui styling system
- **Styling**: Tailwind CSS with CSS variables and modern fitness theme (Black/Red/Grey/White color palette)
- **Design System**: Glassmorphism effects, athletic typography, smooth animations, and energetic visual impact
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
- Integration with ExerciseDB API (RapidAPI) for exercise data
- Exercise search and filtering by body parts, equipment, and targets
- Local caching of exercise data in PostgreSQL
- YouTube API integration for exercise video tutorials

### AI-Powered Workout Planning
- OpenAI GPT-4o integration for personalized workout plan generation
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
5. External API calls made to ExerciseDB, YouTube, and OpenAI
6. JSON responses returned to client with proper error handling

### External API Integration
- **ExerciseDB API**: Exercise data fetching and caching
- **YouTube API**: Video search for exercise tutorials
- **OpenAI API**: AI-powered workout plan generation
- **Neon Database**: Serverless PostgreSQL hosting

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Query
- **UI Components**: Radix UI primitives, shadcn/ui components
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Backend**: Express.js, bcrypt, jsonwebtoken
- **Database**: Drizzle ORM, @neondatabase/serverless
- **External APIs**: axios for HTTP requests
- **Development**: TypeScript, Vite, tsx for development server

### API Keys Required
- `RAPIDAPI_KEY`: For ExerciseDB and YouTube API access
- `OPENAI_API_KEY`: For AI workout plan generation
- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: For JWT token signing

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
- July 13, 2025. Implemented complete UI/UX redesign with modern, energetic fitness aesthetic using Black/Red/Grey/White color palette targeting young fitness enthusiasts
- July 13, 2025. Added comprehensive theme transformation with glassmorphism effects, athletic typography, smooth animations, and premium visual impact
- July 12, 2025. Added comprehensive role-based authentication system with admin dashboard for user monitoring and fitness goal tracking
- July 12, 2025. Completely removed blog feature from the application (routes, components, database schema, and storage)
- June 30, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.

## Current Theme Implementation Status
- ✅ Global CSS theme with Black/Red/Grey/White color palette
- ✅ Navigation component with glassmorphism and athletic typography
- ✅ Footer component with modern branding
- ✅ Home page with energetic hero and action cards
- ✅ BMI Calculator - Complete theme transformation with forms and results
- ✅ Exercise Library - Complete hero section and search interface
- ✅ Calorie Counter - Complete authentication and main layout
- ⏳ Workout Planner - Pending
- ⏳ Workout Tracker - Pending
- ⏳ Weight Tracker - Pending
- ⏳ Auth pages - Pending
- ⏳ Admin Dashboard - Pending