import { 
  users, exercises, workoutPlans, workoutSessions, foodEntries, blogs, blogComments, blogLikes,
  type User, type InsertUser, type Exercise, type InsertExercise, 
  type WorkoutPlan, type InsertWorkoutPlan, type WorkoutSession, type InsertWorkoutSession,
  type FoodEntry, type InsertFoodEntry, type Blog, type InsertBlog,
  type BlogComment, type InsertBlogComment
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

  // Blog operations
  getBlogs(limit?: number, offset?: number, category?: string): Promise<Blog[]>;
  getBlog(id: number): Promise<Blog | undefined>;
  getBlogsByUser(userId: number): Promise<Blog[]>;
  createBlog(blog: InsertBlog): Promise<Blog>;
  updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined>;
  deleteBlog(id: number): Promise<boolean>;
  likeBlog(blogId: number, userId: number): Promise<boolean>;
  unlikeBlog(blogId: number, userId: number): Promise<boolean>;
  getBlogComments(blogId: number): Promise<BlogComment[]>;
  createBlogComment(comment: InsertBlogComment): Promise<BlogComment>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private exercises: Map<number, Exercise>;
  private workoutPlans: Map<number, WorkoutPlan>;
  private workoutSessions: Map<number, WorkoutSession>;
  private foodEntries: Map<number, FoodEntry>;
  private blogs: Map<number, Blog>;
  private blogComments: Map<number, BlogComment>;
  private blogLikes: Map<string, boolean>; // "blogId:userId" -> true
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.exercises = new Map();
    this.workoutPlans = new Map();
    this.workoutSessions = new Map();
    this.foodEntries = new Map();
    this.blogs = new Map();
    this.blogComments = new Map();
    this.blogLikes = new Map();
    this.currentId = 1;
    this.initializeSampleData();
  }

  private initializeSampleData() {
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

  // Blog operations
  async getBlogs(limit = 20, offset = 0, category?: string): Promise<Blog[]> {
    let allBlogs = Array.from(this.blogs.values()).filter(blog => blog.published);
    
    if (category) {
      allBlogs = allBlogs.filter(blog => blog.category === category);
    }
    
    allBlogs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return allBlogs.slice(offset, offset + limit);
  }

  async getBlog(id: number): Promise<Blog | undefined> {
    return this.blogs.get(id);
  }

  async getBlogsByUser(userId: number): Promise<Blog[]> {
    return Array.from(this.blogs.values())
      .filter(blog => blog.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBlog(insertBlog: InsertBlog): Promise<Blog> {
    const id = this.currentId++;
    const blog: Blog = { 
      ...insertBlog, 
      id, 
      likes: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.blogs.set(id, blog);
    return blog;
  }

  async updateBlog(id: number, updates: Partial<InsertBlog>): Promise<Blog | undefined> {
    const blog = this.blogs.get(id);
    if (!blog) return undefined;
    
    const updatedBlog = { ...blog, ...updates, updatedAt: new Date() };
    this.blogs.set(id, updatedBlog);
    return updatedBlog;
  }

  async deleteBlog(id: number): Promise<boolean> {
    return this.blogs.delete(id);
  }

  async likeBlog(blogId: number, userId: number): Promise<boolean> {
    const key = `${blogId}:${userId}`;
    if (this.blogLikes.has(key)) return false;
    
    this.blogLikes.set(key, true);
    const blog = this.blogs.get(blogId);
    if (blog) {
      blog.likes = (blog.likes || 0) + 1;
      this.blogs.set(blogId, blog);
    }
    return true;
  }

  async unlikeBlog(blogId: number, userId: number): Promise<boolean> {
    const key = `${blogId}:${userId}`;
    if (!this.blogLikes.has(key)) return false;
    
    this.blogLikes.delete(key);
    const blog = this.blogs.get(blogId);
    if (blog) {
      blog.likes = Math.max(0, (blog.likes || 0) - 1);
      this.blogs.set(blogId, blog);
    }
    return true;
  }

  async getBlogComments(blogId: number): Promise<BlogComment[]> {
    return Array.from(this.blogComments.values())
      .filter(comment => comment.blogId === blogId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createBlogComment(insertComment: InsertBlogComment): Promise<BlogComment> {
    const id = this.currentId++;
    const comment: BlogComment = { 
      ...insertComment, 
      id, 
      createdAt: new Date() 
    };
    this.blogComments.set(id, comment);
    return comment;
  }
}

export const storage = new MemStorage();
