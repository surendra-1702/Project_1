import type { Express } from "express";
import { createServer, type Server } from "http";
import fs from 'fs';
import path from 'path';
import { storage } from "./storage-local";
// Removed external exercise API - using local exercise data
import { DeepSeekService } from "./services/deepseekService";

const deepseekService = new DeepSeekService();
import { foodApiService } from "./services/foodApi";
import { authenticateToken, requireAdmin, hashPassword, verifyPassword, generateToken, AuthRequest } from "./auth";
import { insertUserSchema, insertWorkoutPlanSchema, insertWorkoutSessionSchema, insertFoodEntrySchema, insertWorkoutTrackerSessionSchema, insertWeightEntrySchema } from "@shared/schema";

// Basic workout generation for fallback
function generateBasicWorkouts(experienceLevel: string, fitnessGoal: string, daysPerWeek: number) {
  const workouts = [];
  
  if (fitnessGoal.includes('muscle') || fitnessGoal.includes('strength')) {
    // Strength/muscle building workouts
    for (let i = 1; i <= daysPerWeek; i++) {
      workouts.push({
        day: i,
        name: `Day ${i} - ${i % 2 === 1 ? 'Upper Body' : 'Lower Body'}`,
        exercises: i % 2 === 1 ? [
          { name: 'Push-ups', sets: experienceLevel === 'beginner' ? 3 : 4, reps: '8-12' },
          { name: 'Pull-ups/Rows', sets: 3, reps: '6-10' },
          { name: 'Shoulder Press', sets: 3, reps: '8-12' },
          { name: 'Chest Press', sets: 3, reps: '8-12' }
        ] : [
          { name: 'Squats', sets: experienceLevel === 'beginner' ? 3 : 4, reps: '10-15' },
          { name: 'Deadlifts', sets: 3, reps: '6-10' },
          { name: 'Lunges', sets: 3, reps: '10-12 each leg' },
          { name: 'Calf Raises', sets: 3, reps: '15-20' }
        ]
      });
    }
  } else {
    // General fitness/weight loss workouts
    for (let i = 1; i <= daysPerWeek; i++) {
      workouts.push({
        day: i,
        name: `Day ${i} - Full Body`,
        exercises: [
          { name: 'Jumping Jacks', sets: 3, reps: '30 seconds' },
          { name: 'Bodyweight Squats', sets: 3, reps: '15-20' },
          { name: 'Push-ups', sets: 3, reps: '8-15' },
          { name: 'Mountain Climbers', sets: 3, reps: '20 seconds' },
          { name: 'Plank', sets: 3, reps: '30-60 seconds' }
        ]
      });
    }
  }
  
  return workouts;
}

export async function registerRoutes(app: Express): Promise<Server> {
  
  // ============= HEALTH CHECK =============
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      timestamp: new Date().toISOString(),
      version: "1.0.0",
      services: {
        database: process.env.DATABASE_URL ? "connected" : "not configured",
        deepseek: process.env.DEEPSEEK_API_KEY ? "configured" : "fallback mode"
      }
    });
  });
  
  // ============= AUTH ROUTES =============
  
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User with this email already exists" });
      }

      const existingUsername = await storage.getUserByUsername(userData.username);
      if (existingUsername) {
        return res.status(400).json({ message: "Username already taken" });
      }

      // Hash password
      const hashedPassword = await hashPassword(userData.password);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = generateToken(user.id, user.username, user.email, user.role || 'user');

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
      res.status(201).json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error: any) {
      console.error('Registration error:', error);
      res.status(400).json({ message: error.message || 'Registration failed' });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Update last login time
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      const token = generateToken(user.id, user.username, user.email, user.role || 'user');

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const user = await storage.getUser(req.user!.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const userId = req.params.id;
      
      // Ensure user can only update their own profile
      if (req.user!.id !== userId) {
        return res.status(403).json({ message: "You can only update your own profile" });
      }

      const updates = req.body;
      const updatedUser = await storage.updateUser(userId, updates);
      
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= EXERCISE ROUTES =============
  
  app.get("/api/exercises", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const exercises = await storage.getExercises(limit, offset);
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.json([]);
      }
      
      const exercises = await storage.searchExercises(query);
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/bodyparts", async (req, res) => {
    try {
      // Return static list of muscle groups that match our GIF folder structure
      const bodyParts = [
        'chest', 'back', 'shoulders', 'traps',
        'legs', 'abs', 'biceps', 'triceps', 'arms', 'cardio', 'forearms'
      ];
      res.json(bodyParts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/bodypart/:name", async (req, res) => {
    try {
      const bodyPart = req.params.name;
      const exercises = await storage.getExercisesByBodyPart(bodyPart);
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/equipment/:name", async (req, res) => {
    try {
      const equipment = req.params.name;
      const exercises = await storage.getExercisesByEquipment(equipment);
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/target/:name", async (req, res) => {
    try {
      const target = req.params.name;
      const exercises = await storage.getExercisesByTarget(target);
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/:id", async (req, res) => {
    try {
      const exerciseId = req.params.id;
      const exercise = await storage.getExerciseById(exerciseId);
      
      if (!exercise) {
        return res.status(404).json({ message: "Exercise not found" });
      }
      
      res.json(exercise);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= LOCAL EXERCISE GIF ROUTES =============
  
  app.get("/api/exercise-gifs/:muscleGroup", async (req, res) => {
    try {
      const { muscleGroup } = req.params;
      
      // Validate muscle group
      const validGroups = [
        'chest', 'back', 'shoulders', 'traps',
        'legs', 'abs', 'biceps', 'triceps', 'arms', 'cardio', 'forearms'
      ];
      
      if (!validGroups.includes(muscleGroup)) {
        return res.status(400).json({ error: 'Invalid muscle group' });
      }
      
      // List available GIF files in the muscle group folder
      
      const gifFolderPath = path.join(process.cwd(), 'public', 'exercise-gifs', muscleGroup);
      
      try {
        const files = fs.readdirSync(gifFolderPath)
          .filter((file: string) => file.endsWith('.gif'))
          .map((file: string) => ({
            filename: file,
            name: file.replace('.gif', '').replace(/-/g, ' '),
            url: `/exercise-gifs/${muscleGroup}/${file}`
          }));
        
        res.json(files);
      } catch (fsError) {
        // If folder doesn't exist or is empty, return empty array
        res.json([]);
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // ============= YOUTUBE ROUTES (kept for workout videos) =============
  
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      // Return empty array since we're not using YouTube API anymore
      res.json([]);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= BMI & CALORIE ROUTES =============
  
  app.post("/api/bmi/calculate", async (req, res) => {
    try {
      const { height, weight, age, gender, activityLevel } = req.body;
      
      if (!height || !weight || !age || !gender || !activityLevel) {
        return res.status(400).json({ message: "All fields are required" });
      }

      // Calculate BMI
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      
      // Determine BMI category
      let category = "";
      if (bmi < 18.5) category = "Underweight";
      else if (bmi < 25) category = "Normal Weight";
      else if (bmi < 30) category = "Overweight";
      else category = "Obese";

      // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
      let bmr;
      if (gender === "male") {
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
      } else {
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
      }

      // Calculate TDEE (Total Daily Energy Expenditure)
      const activityMultipliers = {
        "sedentary": 1.2,
        "light": 1.375,
        "moderate": 1.55,
        "active": 1.725,
        "very-active": 1.9
      };
      
      const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers];

      // Calculate calorie recommendations
      const recommendations = {
        weightLoss: Math.round(tdee - 500), // 500 calorie deficit
        maintenance: Math.round(tdee),
        weightGain: Math.round(tdee + 300) // 300 calorie surplus
      };

      res.json({
        bmi: Math.round(bmi * 10) / 10,
        category,
        bmr: Math.round(bmr),
        tdee: Math.round(tdee),
        recommendations
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= WORKOUT PLAN ROUTES =============
  
  app.post("/api/workout-plans/generate", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const { 
        height, weight, age, gender, activityLevel,
        fitnessGoal, experienceLevel, daysPerWeek, sessionDuration 
      } = req.body;

      // Calculate BMI for the AI request
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      const workoutPlan = await deepseekService.generateWorkoutPlan({
        age, gender, height, weight, bmi,
        fitnessGoal, experienceLevel, daysPerWeek, sessionDuration, activityLevel
      });

      // Save the generated plan to storage
      const savedPlan = await storage.createWorkoutPlan({
        userId: req.user!.id,
        title: workoutPlan.title,
        description: workoutPlan.description,
        goal: fitnessGoal,
        experienceLevel,
        daysPerWeek,
        sessionDuration,
        planData: workoutPlan,
        isActive: true
      });

      res.json(savedPlan);
    } catch (error: any) {
      console.error("Error generating workout plan:", error);
      console.log('Falling back to local workout plan generation');
      
      try {
        // Extract variables for fallback plan generation
        const { height, weight, age, gender, activityLevel, fitnessGoal, experienceLevel, daysPerWeek, sessionDuration } = req.body;
        
        // Generate a basic fallback workout plan
        const fallbackPlan = {
          title: `${experienceLevel.charAt(0).toUpperCase() + experienceLevel.slice(1)} ${fitnessGoal.charAt(0).toUpperCase() + fitnessGoal.slice(1)} Plan`,
          description: `A ${daysPerWeek}-day workout plan designed for ${experienceLevel} level focusing on ${fitnessGoal}`,
          workouts: generateBasicWorkouts(experienceLevel, fitnessGoal, daysPerWeek),
          tips: [
            "Start with proper warm-up (5-10 minutes)",
            "Focus on form over weight",
            "Rest 48-72 hours between training same muscle groups",
            "Stay hydrated throughout your workout",
            "Track your progress and gradually increase intensity"
          ],
          progressionNotes: "Increase weights by 5-10% when you can complete all sets with perfect form."
        };
        
        const savedPlan = await storage.createWorkoutPlan({
          userId: req.user!.id,
          title: fallbackPlan.title,
          description: fallbackPlan.description,
          goal: fitnessGoal,
          experienceLevel,
          daysPerWeek,
          sessionDuration,
          planData: fallbackPlan,
          isActive: true
        });
        
        res.json(savedPlan);
      } catch (fallbackError) {
        console.error("Fallback generation failed:", fallbackError);
        res.status(500).json({ message: "Failed to generate workout plan. Please try again later." });
      }
    }
  });

  app.get("/api/workout-plans", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const plans = await storage.getWorkoutPlans(req.user!.id);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workout-plans/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.getWorkoutPlan(planId);
      
      if (!plan || plan.userId !== req.user!.id) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workout-plans/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const planId = parseInt(req.params.id);
      const updates = req.body;
      
      const plan = await storage.getWorkoutPlan(planId);
      if (!plan || plan.userId !== req.user!.id) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      const updatedPlan = await storage.updateWorkoutPlan(planId, updates);
      res.json(updatedPlan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/workout-plans/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const planId = parseInt(req.params.id);
      
      const plan = await storage.getWorkoutPlan(planId);
      if (!plan || plan.userId !== req.user!.id) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      await storage.deleteWorkoutPlan(planId);
      res.json({ message: "Workout plan deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= WORKOUT SESSION ROUTES =============
  
  app.post("/api/workout-sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const session = await storage.createWorkoutSession(sessionData);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/workout-sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const sessions = await storage.getWorkoutSessions(req.user!.id, date);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workout-sessions/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedSession = await storage.updateWorkoutSession(sessionId, updates);
      if (!updatedSession) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      
      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= FOOD API ROUTES =============
  
  app.get("/api/food/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }

      try {
        // Try to use Edamam API first
        const results = await foodApiService.searchFood(query);
        res.json(results);
      } catch (apiError) {
        // If API fails, provide fallback nutrition data
        console.log('Food API not available, using fallback data');
        const fallbackNutrition = foodApiService.getFallbackNutrition(query, "100g");
        
        res.json([{
          food: {
            foodId: `fallback-${query.toLowerCase().replace(/\s+/g, '-')}`,
            label: query,
            nutrients: {
              ENERC_KCAL: fallbackNutrition.calories,
              PROCNT: fallbackNutrition.protein,
              CHOCDF: fallbackNutrition.carbs,
              FAT: fallbackNutrition.fat
            },
            category: 'Generic'
          },
          measures: [{
            uri: 'http://www.edamam.com/ontologies/edamam.owl#Measure_gram',
            label: 'Gram',
            weight: 1
          }, {
            uri: 'http://www.edamam.com/ontologies/edamam.owl#Measure_serving',
            label: 'Serving',
            weight: 100
          }]
        }]);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/food/nutrition", async (req, res) => {
    try {
      const { foodId, measureUri, quantity, foodName } = req.body;
      
      if (!foodId) {
        return res.status(400).json({ message: "Food ID is required" });
      }

      try {
        // Try to use Edamam API first
        const nutrition = await foodApiService.getFoodNutrition(foodId, measureUri, quantity);
        res.json(nutrition);
      } catch (apiError) {
        // If API fails, provide fallback nutrition data
        console.log('Food nutrition API not available, using fallback data');
        const fallbackNutrition = foodApiService.getFallbackNutrition(foodName || foodId, `${quantity}g`);
        
        res.json({
          calories: fallbackNutrition.calories,
          totalWeight: quantity || 100,
          totalNutrients: {
            ENERC_KCAL: { quantity: fallbackNutrition.calories, unit: 'kcal' },
            PROCNT: { quantity: fallbackNutrition.protein, unit: 'g' },
            CHOCDF: { quantity: fallbackNutrition.carbs, unit: 'g' },
            FAT: { quantity: fallbackNutrition.fat, unit: 'g' }
          }
        });
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= FOOD ENTRY ROUTES =============
  
  app.post("/api/food-entries", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entryData = insertFoodEntrySchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const entry = await storage.createFoodEntry(entryData);
      res.status(201).json(entry);
    } catch (error: any) {
      console.error('Food entry creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/food-entries", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const entries = await storage.getFoodEntries(req.user!.id, date);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/food-entries/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedEntry = await storage.updateFoodEntry(entryId, updates);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      
      res.json(updatedEntry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/food-entries/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entryId = parseInt(req.params.id);
      
      const deleted = await storage.deleteFoodEntry(entryId);
      if (!deleted) {
        return res.status(404).json({ message: "Food entry not found" });
      }
      
      res.json({ message: "Food entry deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= WORKOUT TRACKER ROUTES =============
  
  app.post("/api/workout-tracker-sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessionData = insertWorkoutTrackerSessionSchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const session = await storage.createWorkoutTrackerSession(sessionData);
      res.status(201).json(session);
    } catch (error: any) {
      console.error('Workout tracker session creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/workout-tracker-sessions", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const sessions = await storage.getWorkoutTrackerSessions(req.user!.id, date);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workout-tracker-sessions/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedSession = await storage.updateWorkoutTrackerSession(sessionId, updates);
      if (!updatedSession) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      
      res.json(updatedSession);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/workout-tracker-sessions/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const sessionId = parseInt(req.params.id);
      
      const deleted = await storage.deleteWorkoutTrackerSession(sessionId);
      if (!deleted) {
        return res.status(404).json({ message: "Workout session not found" });
      }
      
      res.json({ message: "Workout session deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workout-tracker-stats", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const stats = await storage.getWorkoutTrackerStats(req.user!.id);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= WEIGHT TRACKING ROUTES =============
  
  app.post("/api/weight-entries", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entryData = insertWeightEntrySchema.parse({
        ...req.body,
        userId: req.user!.id
      });
      
      const entry = await storage.createWeightEntry(entryData);
      res.status(201).json(entry);
    } catch (error: any) {
      console.error('Weight entry creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/weight-entries", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entries = await storage.getWeightEntries(req.user!.id);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/weight-entries/latest", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const latestEntry = await storage.getLatestWeightEntry(req.user!.id);
      res.json(latestEntry || null);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/weight-entries/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entryId = parseInt(req.params.id);
      const updates = req.body;
      
      const updatedEntry = await storage.updateWeightEntry(entryId, updates);
      if (!updatedEntry) {
        return res.status(404).json({ message: "Weight entry not found" });
      }
      
      res.json(updatedEntry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/weight-entries/:id", authenticateToken, async (req: AuthRequest, res) => {
    try {
      const entryId = parseInt(req.params.id);
      
      const deleted = await storage.deleteWeightEntry(entryId);
      if (!deleted) {
        return res.status(404).json({ message: "Weight entry not found" });
      }
      
      res.json({ message: "Weight entry deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= ADMIN ROUTES =============
  
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req: AuthRequest, res) => {
    try {
      const stats = await storage.getUserStats();
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
