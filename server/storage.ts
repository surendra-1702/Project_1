import { 
  users, exercises, workoutPlans, workoutSessions, foodEntries, workoutTrackerSessions, weightEntries,
  type User, type InsertUser, type Exercise, type InsertExercise, 
  type WorkoutPlan, type InsertWorkoutPlan, type WorkoutSession, type InsertWorkoutSession,
  type FoodEntry, type InsertFoodEntry, type WorkoutTrackerSession, type InsertWorkoutTrackerSession,
  type WeightEntry, type InsertWeightEntry
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Exercise operations
  getExercises(limit?: number, offset?: number): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | undefined>;
  getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]>;
  getExercisesByEquipment(equipment: string): Promise<Exercise[]>;
  getExercisesByTarget(target: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  searchExercises(query: string): Promise<Exercise[]>;

  // Workout Plan operations
  getWorkoutPlans(userId: string): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, updates: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;

  // Workout Session operations
  getWorkoutSessions(userId: string, date?: Date): Promise<WorkoutSession[]>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: number, updates: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined>;

  // Food Entry operations
  getFoodEntries(userId: string, date?: Date): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  updateFoodEntry(id: number, updates: Partial<InsertFoodEntry>): Promise<FoodEntry | undefined>;
  deleteFoodEntry(id: number): Promise<boolean>;

  // Workout Tracker operations
  getWorkoutTrackerSessions(userId: string, date?: Date): Promise<WorkoutTrackerSession[]>;
  createWorkoutTrackerSession(session: InsertWorkoutTrackerSession): Promise<WorkoutTrackerSession>;
  updateWorkoutTrackerSession(id: number, updates: Partial<InsertWorkoutTrackerSession>): Promise<WorkoutTrackerSession | undefined>;
  deleteWorkoutTrackerSession(id: number): Promise<boolean>;
  getWorkoutTrackerStats(userId: string): Promise<{
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
  }>;

  // Weight Entry operations
  getWeightEntries(userId: string): Promise<WeightEntry[]>;
  createWeightEntry(entry: InsertWeightEntry): Promise<WeightEntry>;
  updateWeightEntry(id: number, updates: Partial<InsertWeightEntry>): Promise<WeightEntry | undefined>;
  deleteWeightEntry(id: number): Promise<boolean>;
  getLatestWeightEntry(userId: string): Promise<WeightEntry | undefined>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByGoal: Record<string, number>;
    recentLogins: User[];
  }>;

}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const { db } = await import('./db');
    // Generate a unique ID for the user
    const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const userWithId = { ...insertUser, id: userId };
    const [user] = await db
      .insert(users)
      .values(userWithId)
      .returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  // Exercise operations
  async getExercises(limit = 20, offset = 0): Promise<Exercise[]> {
    const { db } = await import('./db');
    return await db.select().from(exercises).limit(limit).offset(offset);
  }

  async getExerciseById(exerciseId: string): Promise<Exercise | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [exercise] = await db.select().from(exercises).where(eq(exercises.exerciseId, exerciseId));
    return exercise || undefined;
  }

  async getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    return await db.select().from(exercises).where(eq(exercises.bodyPart, bodyPart));
  }

  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    return await db.select().from(exercises).where(eq(exercises.equipment, equipment));
  }

  async getExercisesByTarget(target: string): Promise<Exercise[]> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    return await db.select().from(exercises).where(eq(exercises.target, target));
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const { db } = await import('./db');
    const [exercise] = await db
      .insert(exercises)
      .values(insertExercise)
      .returning();
    return exercise;
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    const { db } = await import('./db');
    const { ilike, or } = await import('drizzle-orm');
    const searchPattern = `%${query}%`;
    return await db.select().from(exercises).where(
      or(
        ilike(exercises.name, searchPattern),
        ilike(exercises.bodyPart, searchPattern),
        ilike(exercises.target, searchPattern)
      )
    );
  }

  // Workout Plan operations
  async getWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    return await db.select().from(workoutPlans).where(eq(workoutPlans.userId, userId));
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [plan] = await db.select().from(workoutPlans).where(eq(workoutPlans.id, id));
    return plan || undefined;
  }

  async createWorkoutPlan(insertPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const { db } = await import('./db');
    const [plan] = await db
      .insert(workoutPlans)
      .values(insertPlan)
      .returning();
    return plan;
  }

  async updateWorkoutPlan(id: number, updates: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [plan] = await db
      .update(workoutPlans)
      .set(updates)
      .where(eq(workoutPlans.id, id))
      .returning();
    return plan || undefined;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const result = await db.delete(workoutPlans).where(eq(workoutPlans.id, id));
    return result.rowCount > 0;
  }

  // Workout Session operations
  async getWorkoutSessions(userId: number, date?: Date): Promise<WorkoutSession[]> {
    const { db } = await import('./db');
    const { eq, and, gte, lt } = await import('drizzle-orm');
    
    let whereCondition = eq(workoutSessions.userId, userId);
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereCondition = and(
        eq(workoutSessions.userId, userId),
        gte(workoutSessions.date, startOfDay),
        lt(workoutSessions.date, endOfDay)
      );
    }
    
    return await db.select().from(workoutSessions).where(whereCondition);
  }

  async createWorkoutSession(insertSession: InsertWorkoutSession): Promise<WorkoutSession> {
    const { db } = await import('./db');
    const [session] = await db
      .insert(workoutSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateWorkoutSession(id: number, updates: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [session] = await db
      .update(workoutSessions)
      .set(updates)
      .where(eq(workoutSessions.id, id))
      .returning();
    return session || undefined;
  }

  // Food Entry operations
  async getFoodEntries(userId: number, date?: Date): Promise<FoodEntry[]> {
    const { db } = await import('./db');
    const { eq, and, gte, lt } = await import('drizzle-orm');
    
    let whereCondition = eq(foodEntries.userId, userId);
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereCondition = and(
        eq(foodEntries.userId, userId),
        gte(foodEntries.date, startOfDay),
        lt(foodEntries.date, endOfDay)
      );
    }
    
    return await db.select().from(foodEntries).where(whereCondition);
  }

  async createFoodEntry(insertEntry: InsertFoodEntry): Promise<FoodEntry> {
    const { db } = await import('./db');
    const [entry] = await db
      .insert(foodEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateFoodEntry(id: number, updates: Partial<InsertFoodEntry>): Promise<FoodEntry | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [entry] = await db
      .update(foodEntries)
      .set(updates)
      .where(eq(foodEntries.id, id))
      .returning();
    return entry || undefined;
  }

  async deleteFoodEntry(id: number): Promise<boolean> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const result = await db.delete(foodEntries).where(eq(foodEntries.id, id));
    return result.rowCount > 0;
  }

  // Workout Tracker operations
  async getWorkoutTrackerSessions(userId: number, date?: Date): Promise<WorkoutTrackerSession[]> {
    const { db } = await import('./db');
    const { eq, and, gte, lt } = await import('drizzle-orm');
    
    let whereCondition = eq(workoutTrackerSessions.userId, userId);
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      whereCondition = and(
        eq(workoutTrackerSessions.userId, userId),
        gte(workoutTrackerSessions.date, startOfDay),
        lt(workoutTrackerSessions.date, endOfDay)
      );
    }
    
    return await db.select().from(workoutTrackerSessions).where(whereCondition);
  }

  async createWorkoutTrackerSession(insertSession: InsertWorkoutTrackerSession): Promise<WorkoutTrackerSession> {
    const { db } = await import('./db');
    const [session] = await db
      .insert(workoutTrackerSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async updateWorkoutTrackerSession(id: number, updates: Partial<InsertWorkoutTrackerSession>): Promise<WorkoutTrackerSession | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [session] = await db
      .update(workoutTrackerSessions)
      .set(updates)
      .where(eq(workoutTrackerSessions.id, id))
      .returning();
    return session || undefined;
  }

  async deleteWorkoutTrackerSession(id: number): Promise<boolean> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const result = await db.delete(workoutTrackerSessions).where(eq(workoutTrackerSessions.id, id));
    return result.rowCount > 0;
  }

  async getWorkoutTrackerStats(userId: number): Promise<{
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
  }> {
    const { db } = await import('./db');
    const { eq, sql } = await import('drizzle-orm');
    
    const sessions = await db.select().from(workoutTrackerSessions).where(eq(workoutTrackerSessions.userId, userId));
    
    let totalWorkouts = sessions.length;
    let totalSets = 0;
    let totalReps = 0;
    
    sessions.forEach(session => {
      if (session.exercises && Array.isArray(session.exercises)) {
        session.exercises.forEach((exercise: any) => {
          if (exercise.sets && Array.isArray(exercise.sets)) {
            totalSets += exercise.sets.length;
            exercise.sets.forEach((set: any) => {
              if (set.reps) totalReps += parseInt(set.reps) || 0;
            });
          }
        });
      }
    });
    
    return { totalWorkouts, totalSets, totalReps };
  }

  // Weight Entry operations
  async getWeightEntries(userId: number): Promise<WeightEntry[]> {
    const { db } = await import('./db');
    const { eq, desc } = await import('drizzle-orm');
    return await db.select().from(weightEntries).where(eq(weightEntries.userId, userId)).orderBy(desc(weightEntries.date));
  }

  async createWeightEntry(insertEntry: InsertWeightEntry): Promise<WeightEntry> {
    const { db } = await import('./db');
    const [entry] = await db
      .insert(weightEntries)
      .values(insertEntry)
      .returning();
    return entry;
  }

  async updateWeightEntry(id: number, updates: Partial<InsertWeightEntry>): Promise<WeightEntry | undefined> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const [entry] = await db
      .update(weightEntries)
      .set(updates)
      .where(eq(weightEntries.id, id))
      .returning();
    return entry || undefined;
  }

  async deleteWeightEntry(id: number): Promise<boolean> {
    const { db } = await import('./db');
    const { eq } = await import('drizzle-orm');
    const result = await db.delete(weightEntries).where(eq(weightEntries.id, id));
    return result.rowCount > 0;
  }

  async getLatestWeightEntry(userId: number): Promise<WeightEntry | undefined> {
    const { db } = await import('./db');
    const { eq, desc } = await import('drizzle-orm');
    const [entry] = await db.select().from(weightEntries).where(eq(weightEntries.userId, userId)).orderBy(desc(weightEntries.date)).limit(1);
    return entry || undefined;
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    const { db } = await import('./db');
    return await db.select().from(users);
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByGoal: Record<string, number>;
    recentLogins: User[];
  }> {
    const { db } = await import('./db');
    const { desc, gte } = await import('drizzle-orm');
    
    const allUsers = await db.select().from(users);
    const totalUsers = allUsers.length;
    
    // Active users (logged in within last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = allUsers.filter(user => 
      user.lastLoginAt && user.lastLoginAt >= thirtyDaysAgo
    ).length;
    
    // Users by goal
    const usersByGoal: Record<string, number> = {};
    allUsers.forEach(user => {
      if (user.fitnessGoal) {
        usersByGoal[user.fitnessGoal] = (usersByGoal[user.fitnessGoal] || 0) + 1;
      }
    });
    
    // Recent logins (last 10)
    const recentLogins = await db.select().from(users)
      .where(gte(users.lastLoginAt, thirtyDaysAgo))
      .orderBy(desc(users.lastLoginAt))
      .limit(10);
    
    return { totalUsers, activeUsers, usersByGoal, recentLogins };
  }
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private exercises: Map<number, Exercise>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private workoutSessions: Map<number, WorkoutSession>;
  private foodEntries: Map<number, FoodEntry>;
  private workoutTrackerSessions: Map<number, WorkoutTrackerSession>;
  private weightEntries: Map<number, WeightEntry>;

  private currentId: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.workoutPlans = new Map();
    this.workoutSessions = new Map();
    this.foodEntries = new Map();
    this.workoutTrackerSessions = new Map();
    this.weightEntries = new Map();

    this.currentId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add admin user
    const adminUser = {
      username: 'admin',
      email: 'admin@sportzalfitness.com',
      password: '$2b$10$VH7RYhU41xfkINQ3ctKrFuu83obiSGHmm697O0C/BkRXt6UPl5Q46', // "admin123" hashed
      firstName: 'Admin',
      lastName: 'User',
      age: null,
      height: null,
      weight: null,
      gender: null,
      activityLevel: null,
      fitnessGoal: null,
      dailyCalorieGoal: null,
      role: 'admin',
      lastLoginAt: new Date(),
      createdAt: new Date()
    };

    const adminId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    this.users.set(adminId, { ...adminUser, id: adminId });

    // Add test user
    const testUser = {
      username: 'testuser',
      email: 'test@example.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password123" hashed
      firstName: 'Test',
      lastName: 'User',
      age: 25,
      height: 175,
      weight: 70,
      gender: 'male',
      activityLevel: 'moderate',
      fitnessGoal: 'Build muscle',
      dailyCalorieGoal: 2500,
      role: 'user',
      lastLoginAt: new Date(),
      createdAt: new Date()
    };

    const testId = `user_${Date.now() + 1}_${Math.random().toString(36).substring(2, 15)}`;
    this.users.set(testId, { ...testUser, id: testId });

    // Add some sample exercises for immediate app functionality
    const sampleExercises = [
      {
        exerciseId: "push-up",
        name: "Push-up",
        bodyPart: "chest",
        target: "pectorals",
        equipment: "bodyweight",
        gifUrl: null,
        instructions: ["Start in a plank position with arms straight", "Lower your body until your chest nearly touches the floor", "Push yourself back up to the starting position"]
      },
      {
        exerciseId: "squat",
        name: "Squat",
        bodyPart: "upper legs",
        target: "quadriceps",
        equipment: "bodyweight",
        gifUrl: null,
        instructions: ["Stand with feet shoulder-width apart", "Lower your body as if sitting back into a chair", "Keep your chest up and knees over your toes", "Return to starting position"]
      },
      {
        exerciseId: "pull-up",
        name: "Pull-up",
        bodyPart: "back",
        target: "latissimus dorsi",
        equipment: "pull-up bar",
        gifUrl: null,
        instructions: ["Hang from a pull-up bar with palms facing away", "Pull your body up until your chin clears the bar", "Lower yourself back down with control"]
      },
      {
        exerciseId: "plank",
        name: "Plank",
        bodyPart: "waist",
        target: "abdominals",
        equipment: "bodyweight",
        gifUrl: null,
        instructions: ["Start in a push-up position", "Lower onto your forearms", "Keep your body in a straight line", "Hold the position"]
      },
      {
        exerciseId: "deadlift",
        name: "Deadlift",
        bodyPart: "back",
        target: "spinal erectors",
        equipment: "barbell",
        gifUrl: null,
        instructions: ["Stand with feet hip-width apart, barbell over mid-foot", "Bend at hips and knees to grab the bar", "Keep chest up and back straight", "Drive through heels to stand up"]
      },
      {
        exerciseId: "shoulder-press",
        name: "Shoulder Press",
        bodyPart: "shoulders",
        target: "deltoids",
        equipment: "dumbbells",
        gifUrl: null,
        instructions: ["Stand with dumbbells at shoulder height", "Press weights overhead until arms are fully extended", "Lower weights back to shoulder height with control"]
      }
    ];

    sampleExercises.forEach(exercise => {
      const id = this.currentId++;
      this.exercises.set(id, { ...exercise, id, createdAt: new Date() });
    });
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  // Exercise operations
  async getExercises(limit = 20, offset = 0): Promise<Exercise[]> {
    const allExercises = Array.from(this.exercises.values());
    return allExercises.slice(offset, offset + limit);
  }

  async getExerciseById(exerciseId: string): Promise<Exercise | undefined> {
    return Array.from(this.exercises.values()).find(ex => ex.exerciseId === exerciseId);
  }

  async getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(ex => 
      ex.bodyPart && ex.bodyPart.toLowerCase() === bodyPart.toLowerCase()
    );
  }

  async getExercisesByEquipment(equipment: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(ex => 
      ex.equipment && ex.equipment.toLowerCase() === equipment.toLowerCase()
    );
  }

  async getExercisesByTarget(target: string): Promise<Exercise[]> {
    return Array.from(this.exercises.values()).filter(ex => 
      ex.target && ex.target.toLowerCase() === target.toLowerCase()
    );
  }

  async createExercise(insertExercise: InsertExercise): Promise<Exercise> {
    const id = this.currentId++;
    const exercise: Exercise = { ...insertExercise, id };
    this.exercises.set(id, exercise);
    return exercise;
  }

  async searchExercises(query: string): Promise<Exercise[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.exercises.values()).filter(ex =>
      (ex.name && ex.name.toLowerCase().includes(searchTerm)) ||
      (ex.bodyPart && ex.bodyPart.toLowerCase().includes(searchTerm)) ||
      (ex.target && ex.target.toLowerCase().includes(searchTerm)) ||
      (ex.equipment && ex.equipment.toLowerCase().includes(searchTerm))
    );
  }

  // Workout Plan operations
  async getWorkoutPlans(userId: string): Promise<WorkoutPlan[]> {
    return Array.from(this.workoutPlans.values()).filter(plan => plan.userId === userId);
  }

  async getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined> {
    return this.workoutPlans.get(id);
  }

  async createWorkoutPlan(insertPlan: InsertWorkoutPlan): Promise<WorkoutPlan> {
    const id = this.currentId++;
    const plan: WorkoutPlan = { 
      ...insertPlan, 
      id, 
      createdAt: new Date() 
    };
    this.workoutPlans.set(id, plan);
    return plan;
  }

  async updateWorkoutPlan(id: number, updates: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined> {
    const plan = this.workoutPlans.get(id);
    if (!plan) return undefined;
    
    const updatedPlan = { ...plan, ...updates };
    this.workoutPlans.set(id, updatedPlan);
    return updatedPlan;
  }

  async deleteWorkoutPlan(id: number): Promise<boolean> {
    return this.workoutPlans.delete(id);
  }

  // Workout Session operations
  async getWorkoutSessions(userId: string, date?: Date): Promise<WorkoutSession[]> {
    let sessions = Array.from(this.workoutSessions.values()).filter(session => session.userId === userId);
    
    if (date) {
      const targetDate = new Date(date).toDateString();
      sessions = sessions.filter(session => 
        new Date(session.date).toDateString() === targetDate
      );
    }
    
    return sessions;
  }

  async createWorkoutSession(insertSession: InsertWorkoutSession): Promise<WorkoutSession> {
    const id = this.currentId++;
    const session: WorkoutSession = { ...insertSession, id };
    this.workoutSessions.set(id, session);
    return session;
  }

  async updateWorkoutSession(id: number, updates: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined> {
    const session = this.workoutSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.workoutSessions.set(id, updatedSession);
    return updatedSession;
  }

  // Food Entry operations
  async getFoodEntries(userId: string, date?: Date): Promise<FoodEntry[]> {
    let entries = Array.from(this.foodEntries.values()).filter(entry => entry.userId === userId);
    
    if (date) {
      const targetDate = new Date(date).toDateString();
      entries = entries.filter(entry => 
        new Date(entry.date).toDateString() === targetDate
      );
    }
    
    return entries.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createFoodEntry(insertEntry: InsertFoodEntry): Promise<FoodEntry> {
    const id = this.currentId++;
    const entry: FoodEntry = { ...insertEntry, id };
    this.foodEntries.set(id, entry);
    return entry;
  }

  async updateFoodEntry(id: number, updates: Partial<InsertFoodEntry>): Promise<FoodEntry | undefined> {
    const entry = this.foodEntries.get(id);
    if (!entry) return undefined;
    
    const updatedEntry = { ...entry, ...updates };
    this.foodEntries.set(id, updatedEntry);
    return updatedEntry;
  }

  async deleteFoodEntry(id: number): Promise<boolean> {
    return this.foodEntries.delete(id);
  }

  // Admin operations
  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).map(user => ({
      ...user,
      password: '[HIDDEN]' // Don't expose passwords to admin
    }));
  }

  async getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByGoal: Record<string, number>;
    recentLogins: User[];
  }> {
    const allUsers = Array.from(this.users.values());
    const totalUsers = allUsers.length;
    
    // Consider users who logged in within the last 7 days as active
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const activeUsers = allUsers.filter(user => 
      user.lastLoginAt && new Date(user.lastLoginAt) > sevenDaysAgo
    ).length;

    // Group users by fitness goal
    const usersByGoal: Record<string, number> = {};
    allUsers.forEach(user => {
      if (user.fitnessGoal) {
        usersByGoal[user.fitnessGoal] = (usersByGoal[user.fitnessGoal] || 0) + 1;
      }
    });

    // Get recent logins (last 10 users who logged in)
    const recentLogins = allUsers
      .filter(user => user.lastLoginAt)
      .sort((a, b) => new Date(b.lastLoginAt!).getTime() - new Date(a.lastLoginAt!).getTime())
      .slice(0, 10)
      .map(user => ({
        ...user,
        password: '[HIDDEN]' // Don't expose passwords
      }));

    return {
      totalUsers,
      activeUsers,
      usersByGoal,
      recentLogins
    };
  }

  // Workout Tracker Session operations
  async getWorkoutTrackerSessions(userId: string, date?: Date): Promise<WorkoutTrackerSession[]> {
    const sessions = Array.from(this.workoutTrackerSessions.values())
      .filter(session => session.userId === userId);
    
    if (date) {
      const targetDate = new Date(date).toDateString();
      return sessions.filter(session => 
        new Date(session.date).toDateString() === targetDate
      );
    }
    
    return sessions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async createWorkoutTrackerSession(insertSession: InsertWorkoutTrackerSession): Promise<WorkoutTrackerSession> {
    const id = this.currentId++;
    const session: WorkoutTrackerSession = { 
      ...insertSession, 
      id,
      createdAt: new Date()
    };
    this.workoutTrackerSessions.set(id, session);
    return session;
  }

  async updateWorkoutTrackerSession(id: number, updates: Partial<InsertWorkoutTrackerSession>): Promise<WorkoutTrackerSession | undefined> {
    const session = this.workoutTrackerSessions.get(id);
    if (session) {
      const updatedSession = { ...session, ...updates };
      this.workoutTrackerSessions.set(id, updatedSession);
      return updatedSession;
    }
    return undefined;
  }

  async deleteWorkoutTrackerSession(id: number): Promise<boolean> {
    return this.workoutTrackerSessions.delete(id);
  }

  async getWorkoutTrackerStats(userId: string): Promise<{
    totalWorkouts: number;
    totalSets: number;
    totalReps: number;
  }> {
    const sessions = Array.from(this.workoutTrackerSessions.values())
      .filter(session => session.userId === userId);
    
    const stats = sessions.reduce((acc, session) => {
      let sessionSets = 0;
      let sessionReps = 0;
      
      // Handle both old format (single exercise) and new format (multiple exercises)
      if (session.exercises && Array.isArray(session.exercises)) {
        // New format with multiple exercises
        session.exercises.forEach((exercise: any) => {
          sessionSets += exercise.sets;
          sessionReps += exercise.sets * exercise.reps;
        });
      } else if (session.sets && session.repsPerSet) {
        // Old format with single exercise
        sessionSets = session.sets;
        sessionReps = session.sets * session.repsPerSet;
      }
      
      return {
        totalWorkouts: acc.totalWorkouts + 1,
        totalSets: acc.totalSets + sessionSets,
        totalReps: acc.totalReps + sessionReps
      };
    }, {
      totalWorkouts: 0,
      totalSets: 0,
      totalReps: 0
    });
    
    return stats;
  }

  // Weight Entry operations
  async getWeightEntries(userId: string): Promise<WeightEntry[]> {
    return Array.from(this.weightEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createWeightEntry(insertEntry: InsertWeightEntry): Promise<WeightEntry> {
    const id = this.currentId++;
    const entry: WeightEntry = { 
      ...insertEntry, 
      id,
      createdAt: new Date()
    };
    this.weightEntries.set(id, entry);
    return entry;
  }

  async updateWeightEntry(id: number, updates: Partial<InsertWeightEntry>): Promise<WeightEntry | undefined> {
    const entry = this.weightEntries.get(id);
    if (entry) {
      const updatedEntry = { ...entry, ...updates };
      this.weightEntries.set(id, updatedEntry);
      return updatedEntry;
    }
    return undefined;
  }

  async deleteWeightEntry(id: number): Promise<boolean> {
    return this.weightEntries.delete(id);
  }

  async getLatestWeightEntry(userId: string): Promise<WeightEntry | undefined> {
    const entries = await this.getWeightEntries(userId);
    return entries.length > 0 ? entries[entries.length - 1] : undefined;
  }

}

export const storage = new DatabaseStorage();
