import { 
  users, exercises, workoutPlans, workoutSessions, foodEntries,
  type User, type InsertUser, type Exercise, type InsertExercise, 
  type WorkoutPlan, type InsertWorkoutPlan, type WorkoutSession, type InsertWorkoutSession,
  type FoodEntry, type InsertFoodEntry
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Exercise operations
  getExercises(limit?: number, offset?: number): Promise<Exercise[]>;
  getExerciseById(id: string): Promise<Exercise | undefined>;
  getExercisesByBodyPart(bodyPart: string): Promise<Exercise[]>;
  getExercisesByEquipment(equipment: string): Promise<Exercise[]>;
  getExercisesByTarget(target: string): Promise<Exercise[]>;
  createExercise(exercise: InsertExercise): Promise<Exercise>;
  searchExercises(query: string): Promise<Exercise[]>;

  // Workout Plan operations
  getWorkoutPlans(userId: number): Promise<WorkoutPlan[]>;
  getWorkoutPlan(id: number): Promise<WorkoutPlan | undefined>;
  createWorkoutPlan(plan: InsertWorkoutPlan): Promise<WorkoutPlan>;
  updateWorkoutPlan(id: number, updates: Partial<InsertWorkoutPlan>): Promise<WorkoutPlan | undefined>;
  deleteWorkoutPlan(id: number): Promise<boolean>;

  // Workout Session operations
  getWorkoutSessions(userId: number, date?: Date): Promise<WorkoutSession[]>;
  createWorkoutSession(session: InsertWorkoutSession): Promise<WorkoutSession>;
  updateWorkoutSession(id: number, updates: Partial<InsertWorkoutSession>): Promise<WorkoutSession | undefined>;

  // Food Entry operations
  getFoodEntries(userId: number, date?: Date): Promise<FoodEntry[]>;
  createFoodEntry(entry: InsertFoodEntry): Promise<FoodEntry>;
  updateFoodEntry(id: number, updates: Partial<InsertFoodEntry>): Promise<FoodEntry | undefined>;
  deleteFoodEntry(id: number): Promise<boolean>;

  // Admin operations
  getAllUsers(): Promise<User[]>;
  getUserStats(): Promise<{
    totalUsers: number;
    activeUsers: number;
    usersByGoal: Record<string, number>;
    recentLogins: User[];
  }>;


}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private workoutSessions: Map<number, WorkoutSession>;
  private foodEntries: Map<number, FoodEntry>;

  private currentId: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.workoutPlans = new Map();
    this.workoutSessions = new Map();
    this.foodEntries = new Map();

    this.currentId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
    // Add sample users for testing (using a simple password for demo)
    // In production, these would be properly hashed
    const sampleUsers = [
      {
        username: 'admin',
        email: 'admin@fittrackpro.com',
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
      },
      {
        username: 'testuser',
        email: 'test@example.com',
        password: '$2b$10$dhVWpqhP0mrBxOk8NhvGJuHl8ma3enI10vVGpBcXfm6DpKOO9.8UW', // "password123" hashed
        firstName: 'Test',
        lastName: 'User',
        age: 25,
        height: 175,
        weight: 70,
        gender: 'male',
        activityLevel: 'moderate',
        fitnessGoal: 'muscle-gain',
        dailyCalorieGoal: 2500,
        role: 'user',
        lastLoginAt: new Date(),
        createdAt: new Date()
      },
      {
        username: 'jane',
        email: 'jane@example.com',
        password: '$2b$10$dhVWpqhP0mrBxOk8NhvGJuHl8ma3enI10vVGpBcXfm6DpKOO9.8UW', // "password123" hashed
        firstName: 'Jane',
        lastName: 'Smith',
        age: 28,
        height: 165,
        weight: 60,
        gender: 'female',
        activityLevel: 'active',
        fitnessGoal: 'weight-loss',
        dailyCalorieGoal: 2000,
        role: 'user',
        lastLoginAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        createdAt: new Date()
      },
      {
        username: 'mike',
        email: 'mike@example.com',
        password: '$2b$10$dhVWpqhP0mrBxOk8NhvGJuHl8ma3enI10vVGpBcXfm6DpKOO9.8UW',
        firstName: 'Mike',
        lastName: 'Johnson',
        age: 32,
        height: 185,
        weight: 85,
        gender: 'male',
        activityLevel: 'very-active',
        fitnessGoal: 'strength',
        dailyCalorieGoal: 3000,
        role: 'user',
        lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        createdAt: new Date()
      },
      {
        username: 'sarah',
        email: 'sarah@example.com',
        password: '$2b$10$dhVWpqhP0mrBxOk8NhvGJuHl8ma3enI10vVGpBcXfm6DpKOO9.8UW',
        firstName: 'Sarah',
        lastName: 'Davis',
        age: 26,
        height: 168,
        weight: 62,
        gender: 'female',
        activityLevel: 'moderate',
        fitnessGoal: 'endurance',
        dailyCalorieGoal: 2200,
        role: 'user',
        lastLoginAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000), // 10 days ago (inactive)
        createdAt: new Date()
      }
    ];

    sampleUsers.forEach(user => {
      const id = this.currentId++;
      this.users.set(id, { ...user, id });
    });

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
      this.exercises.set(id, { ...exercise, id });
    });
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      createdAt: new Date() 
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, updates: Partial<InsertUser>): Promise<User | undefined> {
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
  async getWorkoutPlans(userId: number): Promise<WorkoutPlan[]> {
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
  async getWorkoutSessions(userId: number, date?: Date): Promise<WorkoutSession[]> {
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
  async getFoodEntries(userId: number, date?: Date): Promise<FoodEntry[]> {
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

}

export const storage = new MemStorage();
