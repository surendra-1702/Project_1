import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { exerciseApiService } from "./services/exerciseApi";
import { youtubeApiService } from "./services/youtubeApi";
import { openaiService } from "./services/openaiService";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { insertUserSchema, insertWorkoutPlanSchema, insertWorkoutSessionSchema, insertFoodEntrySchema, insertBlogSchema, insertBlogCommentSchema } from "@shared/schema";

const JWT_SECRET = process.env.JWT_SECRET || "fitness-app-secret-key";

// Middleware to verify JWT tokens
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

export async function registerRoutes(app: Express): Promise<Server> {
  
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
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword
      });

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Don't send password in response
      const { password, ...userWithoutPassword } = user;
      
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

      const token = jwt.sign(
        { userId: user.id, email: user.email },
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
            exercise.name.toLowerCase().includes(query.toLowerCase()) ||
            exercise.bodyPart.toLowerCase().includes(query.toLowerCase()) ||
            exercise.target.toLowerCase().includes(query.toLowerCase()) ||
            exercise.equipment.toLowerCase().includes(query.toLowerCase())
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
      }
      
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

  // ============= YOUTUBE ROUTES =============
  
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ message: "Search query is required" });
      }
      
      const videos = await youtubeApiService.searchVideos(query);
      res.json(videos);
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

  // ============= BLOG ROUTES =============
  
  app.get("/api/blogs", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      const category = req.query.category as string;
      
      const blogs = await storage.getBlogs(limit, offset, category);
      res.json(blogs);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blogs/:id", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const blog = await storage.getBlog(blogId);
      
      if (!blog) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      res.json(blog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/blogs", authenticateToken, async (req, res) => {
    try {
      const blogData = insertBlogSchema.parse({
        ...req.body,
        userId: req.user.userId
      });
      
      const blog = await storage.createBlog(blogData);
      res.status(201).json(blog);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.put("/api/blogs/:id", authenticateToken, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const updates = req.body;
      
      const blog = await storage.getBlog(blogId);
      if (!blog || blog.userId !== req.user.userId) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      const updatedBlog = await storage.updateBlog(blogId, updates);
      res.json(updatedBlog);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/blogs/:id", authenticateToken, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      
      const blog = await storage.getBlog(blogId);
      if (!blog || blog.userId !== req.user.userId) {
        return res.status(404).json({ message: "Blog not found" });
      }
      
      await storage.deleteBlog(blogId);
      res.json({ message: "Blog deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/blogs/:id/like", authenticateToken, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const liked = await storage.likeBlog(blogId, req.user.userId);
      
      if (!liked) {
        return res.status(400).json({ message: "Blog already liked or not found" });
      }
      
      res.json({ message: "Blog liked successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/blogs/:id/like", authenticateToken, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const unliked = await storage.unlikeBlog(blogId, req.user.userId);
      
      if (!unliked) {
        return res.status(400).json({ message: "Blog not liked or not found" });
      }
      
      res.json({ message: "Blog unliked successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/blogs/:id/comments", async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const comments = await storage.getBlogComments(blogId);
      res.json(comments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/blogs/:id/comments", authenticateToken, async (req, res) => {
    try {
      const blogId = parseInt(req.params.id);
      const commentData = insertBlogCommentSchema.parse({
        ...req.body,
        blogId,
        userId: req.user.userId
      });
      
      const comment = await storage.createBlogComment(commentData);
      res.status(201).json(comment);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
