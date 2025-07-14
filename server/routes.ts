import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exerciseApiService } from "./services/exerciseApi";
import { youtubeApiService } from "./services/youtubeApi";
import { openaiService } from "./services/openaiService";
import { foodApiService } from "./services/foodApi";
import { setupGoogleAuth, requireAuth } from "./auth/googleAuth";
import { insertWorkoutPlanSchema, insertWorkoutSessionSchema, insertFoodEntrySchema, insertWorkoutTrackerSessionSchema, insertWeightEntrySchema } from "@shared/schema";

// Middleware to check admin role
const requireAdmin = (req: any, res: any, next: any) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Setup Google OAuth authentication
  setupGoogleAuth(app);
  
  // ============= AUTH ROUTES =============
  // Google OAuth routes are handled in setupGoogleAuth
  
  // Get current user endpoint
  app.get("/api/auth/user", (req, res) => {
    if (req.isAuthenticated() && req.user) {
      res.json(req.user);
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  });
      
      res.status(201).json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Update last login time
      await storage.updateUser(user.id, { lastLoginAt: new Date() });

      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      const { password: _, ...userWithoutPassword } = user;
      
      res.json({ 
        user: userWithoutPassword, 
        token 
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/auth/me", authenticateToken, async (req, res) => {
    try {
      const user = await storage.getUser(req.user.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/users/:id", authenticateToken, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Ensure user can only update their own profile
      if (req.user.userId !== userId) {
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
      
      // First try to get from local storage
      let exercises = await storage.getExercises(limit, offset);
      
      // If no exercises in storage, fetch from API and store
      if (exercises.length === 0) {
        const apiExercises = await exerciseApiService.fetchExercises(limit, offset);
        
        for (const apiExercise of apiExercises) {
          await storage.createExercise({
            exerciseId: apiExercise.id,
            name: apiExercise.name,
            bodyPart: apiExercise.bodyPart,
            target: apiExercise.target,
            equipment: apiExercise.equipment,
            gifUrl: apiExercise.gifUrl,
            instructions: apiExercise.instructions
          });
        }
        
        exercises = await storage.getExercises(limit, offset);
      }
      
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
      
      // First search in local storage
      let exercises = await storage.searchExercises(query);
      
      // If no results in local storage, fetch from API
      if (exercises.length === 0) {
        try {
          // Since the API doesn't have a direct search, we'll fetch all exercises and filter
          const apiExercises = await exerciseApiService.fetchExercises(50, 0);
          const filteredExercises = apiExercises.filter(exercise => 
            (exercise.name && exercise.name.toLowerCase().includes(query.toLowerCase())) ||
            (exercise.bodyPart && exercise.bodyPart.toLowerCase().includes(query.toLowerCase())) ||
            (exercise.target && exercise.target.toLowerCase().includes(query.toLowerCase())) ||
            (exercise.equipment && exercise.equipment.toLowerCase().includes(query.toLowerCase()))
          );
          
          // Store filtered exercises in local storage
          for (const apiExercise of filteredExercises) {
            await storage.createExercise({
              exerciseId: apiExercise.id,
              name: apiExercise.name,
              bodyPart: apiExercise.bodyPart,
              target: apiExercise.target,
              equipment: apiExercise.equipment,
              gifUrl: apiExercise.gifUrl,
              instructions: apiExercise.instructions
            });
          }
          
          exercises = filteredExercises.map((ex, index) => ({
            id: index + 1,
            exerciseId: ex.id,
            name: ex.name,
            bodyPart: ex.bodyPart,
            target: ex.target,
            equipment: ex.equipment,
            gifUrl: ex.gifUrl,
            instructions: ex.instructions
          }));
        } catch (apiError) {
          console.error('API search failed:', apiError);
        }
      }
      
      res.json(exercises);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/bodyparts", async (req, res) => {
    try {
      const bodyParts = await exerciseApiService.fetchBodyParts();
      res.json(bodyParts);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/exercises/bodypart/:name", async (req, res) => {
    try {
      const bodyPart = req.params.name;
      let exercises = await storage.getExercisesByBodyPart(bodyPart);
      
      // If no exercises for this body part, fetch from API
      if (exercises.length === 0) {
        try {
          const apiExercises = await exerciseApiService.fetchExercisesByBodyPart(bodyPart, 20, 0);
          
          for (const apiExercise of apiExercises) {
            await storage.createExercise({
              exerciseId: apiExercise.id,
              name: apiExercise.name,
              bodyPart: apiExercise.bodyPart,
              target: apiExercise.target,
              equipment: apiExercise.equipment,
              gifUrl: apiExercise.gifUrl,
              instructions: apiExercise.instructions
            });
          }
          
          exercises = await storage.getExercisesByBodyPart(bodyPart);
        } catch (apiError) {
          console.error(`API fetch failed for body part ${bodyPart}:`, apiError);
          // Return empty array if API fails - user needs to provide API keys
          res.json([]);
          return;
        }
      }
      
      res.json(exercises);
    } catch (error: any) {
      console.error(`Error fetching exercises for body part ${bodyPart}:`, error.message);
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

  // ============= YOUTUBE ROUTES =============
  
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      try {
        const videos = await youtubeApiService.searchVideos(query);
        res.json(videos);
      } catch (apiError) {
        console.error('YouTube API failed:', apiError);
        // Return empty array if YouTube API fails - user needs to provide API keys
        res.json([]);
      }
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/youtube/channel/:id", async (req, res) => {
    try {
      const channelId = req.params.id;
      const channelInfo = await youtubeApiService.getChannelInfo(channelId);
      res.json(channelInfo);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= EXERCISE GIF PROXY =============
  
  app.get("/api/exercise-gif/:exerciseId", async (req, res) => {
    try {
      const { exerciseId } = req.params;
      const gifUrl = `https://cdn-exercisedb.vercel.app/api/v1/images/${exerciseId}.gif`;
      
      const response = await fetch(gifUrl);
      if (!response.ok) {
        return res.status(404).json({ error: 'GIF not found' });
      }
      
      // Set appropriate headers for GIF content
      res.set({
        'Content-Type': 'image/gif',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
        'Access-Control-Allow-Origin': '*'
      });
      
      // Pipe the GIF data directly to the response
      const buffer = await response.arrayBuffer();
      res.send(Buffer.from(buffer));
    } catch (error: any) {
      console.error('GIF proxy error:', error.message);
      res.status(500).json({ error: 'Failed to fetch GIF' });
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
  
  app.post("/api/workout-plans/generate", authenticateToken, async (req, res) => {
    try {
      const { 
        height, weight, age, gender, activityLevel,
        fitnessGoal, experienceLevel, daysPerWeek, sessionDuration 
      } = req.body;

      // Calculate BMI for the AI request
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);

      const workoutPlan = await openaiService.generateWorkoutPlan({
        age, gender, height, weight, bmi,
        fitnessGoal, experienceLevel, daysPerWeek, sessionDuration, activityLevel
      });

      // Save the generated plan to storage
      const savedPlan = await storage.createWorkoutPlan({
        userId: req.user.userId,
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
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workout-plans", authenticateToken, async (req, res) => {
    try {
      const plans = await storage.getWorkoutPlans(req.user.userId);
      res.json(plans);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/workout-plans/:id", authenticateToken, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const plan = await storage.getWorkoutPlan(planId);
      
      if (!plan || plan.userId !== req.user.userId) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      res.json(plan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workout-plans/:id", authenticateToken, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      const updates = req.body;
      
      const plan = await storage.getWorkoutPlan(planId);
      if (!plan || plan.userId !== req.user.userId) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      const updatedPlan = await storage.updateWorkoutPlan(planId, updates);
      res.json(updatedPlan);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/workout-plans/:id", authenticateToken, async (req, res) => {
    try {
      const planId = parseInt(req.params.id);
      
      const plan = await storage.getWorkoutPlan(planId);
      if (!plan || plan.userId !== req.user.userId) {
        return res.status(404).json({ message: "Workout plan not found" });
      }
      
      await storage.deleteWorkoutPlan(planId);
      res.json({ message: "Workout plan deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= WORKOUT SESSION ROUTES =============
  
  app.post("/api/workout-sessions", authenticateToken, async (req, res) => {
    try {
      const sessionData = insertWorkoutSessionSchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const session = await storage.createWorkoutSession(sessionData);
      res.status(201).json(session);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/workout-sessions", authenticateToken, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const sessions = await storage.getWorkoutSessions(req.user.userId, date);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workout-sessions/:id", authenticateToken, async (req, res) => {
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
  
  app.post("/api/food-entries", authenticateToken, async (req, res) => {
    try {
      const entryData = insertFoodEntrySchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const entry = await storage.createFoodEntry(entryData);
      res.status(201).json(entry);
    } catch (error: any) {
      console.error('Food entry creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/food-entries", authenticateToken, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const entries = await storage.getFoodEntries(req.user.userId, date);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/food-entries/:id", authenticateToken, async (req, res) => {
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

  app.delete("/api/food-entries/:id", authenticateToken, async (req, res) => {
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
  
  app.post("/api/workout-tracker-sessions", authenticateToken, async (req, res) => {
    try {
      const sessionData = insertWorkoutTrackerSessionSchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const session = await storage.createWorkoutTrackerSession(sessionData);
      res.status(201).json(session);
    } catch (error: any) {
      console.error('Workout tracker session creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/workout-tracker-sessions", authenticateToken, async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : undefined;
      const sessions = await storage.getWorkoutTrackerSessions(req.user.userId, date);
      res.json(sessions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/workout-tracker-sessions/:id", authenticateToken, async (req, res) => {
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

  app.delete("/api/workout-tracker-sessions/:id", authenticateToken, async (req, res) => {
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

  app.get("/api/workout-tracker-stats", authenticateToken, async (req, res) => {
    try {
      const stats = await storage.getWorkoutTrackerStats(req.user.userId);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // ============= WEIGHT TRACKING ROUTES =============
  
  app.post("/api/weight-entries", authenticateToken, async (req, res) => {
    try {
      const entryData = insertWeightEntrySchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const entry = await storage.createWeightEntry(entryData);
      res.status(201).json(entry);
    } catch (error: any) {
      console.error('Weight entry creation error:', error);
      res.status(400).json({ message: error.message });
    }
  });

  app.get("/api/weight-entries", authenticateToken, async (req, res) => {
    try {
      const entries = await storage.getWeightEntries(req.user.userId);
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/weight-entries/latest", authenticateToken, async (req, res) => {
    try {
      const latestEntry = await storage.getLatestWeightEntry(req.user.userId);
      res.json(latestEntry || null);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/weight-entries/:id", authenticateToken, async (req, res) => {
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

  app.delete("/api/weight-entries/:id", authenticateToken, async (req, res) => {
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
  
  app.get("/api/admin/users", authenticateToken, requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/admin/stats", authenticateToken, requireAdmin, async (req, res) => {
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
