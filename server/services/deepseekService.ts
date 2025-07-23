import OpenAI from "openai";

// Using DeepSeek R1 model instead of OpenAI GPT-4o for workout plan generation
// Only initialize client if API key is available to prevent errors
const deepseek = process.env.DEEPSEEK_API_KEY ? new OpenAI({ 
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: "https://api.deepseek.com/v1"
}) : null;

interface WorkoutPlanRequest {
  age: number;
  gender: string;
  height: number; // cm
  weight: number; // kg
  bmi: number;
  fitnessGoal: string;
  experienceLevel: string;
  daysPerWeek: number;
  sessionDuration: number; // minutes
  activityLevel: string;
}

interface WorkoutPlanResponse {
  title: string;
  description: string;
  weeklySchedule: {
    day: number;
    name: string;
    focus: string;
    duration: number;
    exercises: {
      name: string;
      sets: string;
      reps: string;
      notes: string;
      restTime: string;
    }[];
  }[];
  tips: string[];
  progressionNotes: string;
}

export class DeepSeekService {
  async generateWorkoutPlan(request: WorkoutPlanRequest): Promise<WorkoutPlanResponse> {
    // First try DeepSeek API
    try {
      return await this.generateWithDeepSeek(request);
    } catch (error: any) {
      console.error('DeepSeek generation failed:', error.message);
      
      // Always use fallback plan when DeepSeek API fails
      console.log('Using fallback workout plan generation due to DeepSeek API issues');
      return this.generateFallbackPlan(request);
    }
  }

  private async generateWithDeepSeek(request: WorkoutPlanRequest): Promise<WorkoutPlanResponse> {
    if (!deepseek) {
      throw new Error('DeepSeek API key not configured');
    }
    
    try {
      const prompt = this.buildWorkoutPlanPrompt(request);

      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a certified personal trainer and fitness expert. Generate detailed, safe, and effective workout plans based on user requirements. Always provide specific exercise names, sets, reps, and safety notes. Respond with valid JSON only."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      });

      const content = response.choices[0].message.content || '{}';
      
      // DeepSeek R1 might return reasoning traces, extract just the JSON
      let jsonContent = content;
      if (content.includes('```json')) {
        const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/);
        if (jsonMatch) {
          jsonContent = jsonMatch[1];
        }
      }
      
      const result = JSON.parse(jsonContent);
      return result as WorkoutPlanResponse;
    } catch (error: any) {
      console.error('Error generating workout plan with DeepSeek:', error);
      
      // Handle specific DeepSeek errors
      if (error.status === 429) {
        throw new Error('DeepSeek API quota exceeded. Please check your billing plan at https://platform.deepseek.com/usage');
      } else if (error.status === 401) {
        throw new Error('Invalid DeepSeek API key. Please check your API configuration.');
      } else if (error.status === 400) {
        throw new Error('Invalid request to DeepSeek. Please try different parameters.');
      }
      
      throw new Error('Failed to generate workout plan with DeepSeek. Please try again or contact support.');
    }
  }

  private generateFallbackPlan(request: WorkoutPlanRequest): WorkoutPlanResponse {
    // Generate a basic but effective workout plan based on common fitness principles
    const isBeginnerOrIntermediate = request.experienceLevel === 'beginner' || request.experienceLevel === 'intermediate';
    const focusAreas = this.getFocusAreasForGoal(request.fitnessGoal);
    
    const weeklySchedule = [];
    
    for (let day = 1; day <= request.daysPerWeek; day++) {
      const focus = focusAreas[day % focusAreas.length];
      const exercises = this.getExercisesForFocus(focus, isBeginnerOrIntermediate);
      
      weeklySchedule.push({
        day,
        name: `Day ${day}: ${focus}`,
        focus,
        duration: request.sessionDuration,
        exercises
      });
    }

    return {
      title: `${request.daysPerWeek}-Day ${request.fitnessGoal} Plan`,
      description: `A structured ${request.daysPerWeek}-day workout plan designed for ${request.fitnessGoal.toLowerCase()} with ${request.experienceLevel} level exercises. Each session lasts approximately ${request.sessionDuration} minutes.`,
      weeklySchedule,
      tips: this.getTipsForGoal(request.fitnessGoal),
      progressionNotes: `Start with lighter weights and focus on proper form. Increase weight by 5-10% when you can complete all sets with good form. Rest 48-72 hours between training the same muscle groups.`
    };
  }

  private getFocusAreasForGoal(goal: string): string[] {
    switch (goal.toLowerCase()) {
      case 'weight loss':
      case 'fat loss':
        return ['Full Body Circuit', 'Cardio & Core', 'Upper Body Strength'];
      case 'muscle gain':
      case 'build muscle':
        return ['Push (Chest/Shoulders/Triceps)', 'Pull (Back/Biceps)', 'Legs & Glutes'];
      case 'strength':
      case 'get stronger':
        return ['Upper Body Strength', 'Lower Body Strength', 'Core & Stability'];
      case 'endurance':
        return ['Cardio Endurance', 'Muscular Endurance', 'Mixed Training'];
      default:
        return ['Full Body Strength', 'Cardio & Flexibility', 'Functional Training'];
    }
  }

  private getExercisesForFocus(focus: string, isBeginnerOrIntermediate: boolean) {
    const exerciseDatabase: Record<string, any[]> = {
      'Full Body Circuit': [
        { name: 'Bodyweight Squats', sets: '3', reps: '12-15', notes: 'Keep chest up, knees behind toes', restTime: '30-45 seconds' },
        { name: 'Push-ups', sets: '3', reps: '8-12', notes: 'Modify on knees if needed', restTime: '30-45 seconds' },
        { name: 'Plank Hold', sets: '3', reps: '30-60 seconds', notes: 'Keep body straight', restTime: '30 seconds' },
        { name: 'Mountain Climbers', sets: '3', reps: '20 total', notes: 'Quick feet, strong core', restTime: '45 seconds' },
        { name: 'Lunges', sets: '2', reps: '10 each leg', notes: 'Step far enough forward', restTime: '30 seconds' }
      ],
      'Push (Chest/Shoulders/Triceps)': [
        { name: 'Bench Press', sets: '4', reps: isBeginnerOrIntermediate ? '8-10' : '6-8', notes: 'Control the weight down', restTime: '2-3 minutes' },
        { name: 'Overhead Press', sets: '3', reps: '8-10', notes: 'Keep core tight', restTime: '2 minutes' },
        { name: 'Incline Dumbbell Press', sets: '3', reps: '10-12', notes: 'Squeeze chest at top', restTime: '90 seconds' },
        { name: 'Lateral Raises', sets: '3', reps: '12-15', notes: 'Light weight, control movement', restTime: '60 seconds' },
        { name: 'Tricep Dips', sets: '3', reps: '8-12', notes: 'Lower slowly', restTime: '60 seconds' }
      ],
      'Pull (Back/Biceps)': [
        { name: 'Pull-ups/Lat Pulldown', sets: '4', reps: isBeginnerOrIntermediate ? '6-8' : '8-10', notes: 'Full range of motion', restTime: '2-3 minutes' },
        { name: 'Bent-over Rows', sets: '3', reps: '8-10', notes: 'Keep back straight', restTime: '2 minutes' },
        { name: 'Face Pulls', sets: '3', reps: '12-15', notes: 'Squeeze shoulder blades', restTime: '90 seconds' },
        { name: 'Bicep Curls', sets: '3', reps: '10-12', notes: 'Control the negative', restTime: '60 seconds' },
        { name: 'Hammer Curls', sets: '2', reps: '12-15', notes: 'Keep elbows stable', restTime: '60 seconds' }
      ],
      'Legs & Glutes': [
        { name: 'Squats', sets: '4', reps: isBeginnerOrIntermediate ? '10-12' : '8-10', notes: 'Full depth, chest up', restTime: '2-3 minutes' },
        { name: 'Romanian Deadlifts', sets: '3', reps: '10-12', notes: 'Hinge at hips', restTime: '2 minutes' },
        { name: 'Bulgarian Split Squats', sets: '3', reps: '10 each leg', notes: 'Focus on front leg', restTime: '90 seconds' },
        { name: 'Hip Thrusts', sets: '3', reps: '12-15', notes: 'Squeeze glutes at top', restTime: '90 seconds' },
        { name: 'Calf Raises', sets: '3', reps: '15-20', notes: 'Full range of motion', restTime: '60 seconds' }
      ],
      'Cardio & Core': [
        { name: 'Jumping Jacks', sets: '3', reps: '30 seconds', notes: 'Keep pace steady', restTime: '30 seconds' },
        { name: 'Burpees', sets: '3', reps: '8-10', notes: 'Full body movement', restTime: '60 seconds' },
        { name: 'Russian Twists', sets: '3', reps: '20 total', notes: 'Engage core throughout', restTime: '45 seconds' },
        { name: 'Dead Bug', sets: '3', reps: '10 each side', notes: 'Keep lower back pressed down', restTime: '30 seconds' },
        { name: 'High Knees', sets: '3', reps: '30 seconds', notes: 'Drive knees up high', restTime: '30 seconds' }
      ]
    };

    return exerciseDatabase[focus] || exerciseDatabase['Full Body Circuit'];
  }

  private getTipsForGoal(goal: string): string[] {
    const generalTips = [
      'Always warm up for 5-10 minutes before starting your workout',
      'Focus on proper form over heavy weight',
      'Stay hydrated throughout your workout',
      'Get adequate rest between workout days'
    ];

    const goalSpecificTips: Record<string, string[]> = {
      'weight loss': ['Combine with a caloric deficit diet', 'Include cardio 3-4 times per week'],
      'muscle gain': ['Eat in a slight caloric surplus', 'Prioritize protein intake (0.8-1g per lb bodyweight)'],
      'strength': ['Focus on progressive overload', 'Allow 2-3 minutes rest between heavy sets'],
      'endurance': ['Gradually increase workout duration', 'Include both steady-state and interval training']
    };

    const specific = goalSpecificTips[goal.toLowerCase()] || [];
    return [...generalTips, ...specific];
  }

  private buildWorkoutPlanPrompt(request: WorkoutPlanRequest): string {
    return `Generate a ${request.daysPerWeek}-day weekly workout plan for a ${request.age}-year-old ${request.gender} with the following details:

Physical Stats:
- Height: ${request.height}cm
- Weight: ${request.weight}kg  
- BMI: ${request.bmi}
- Activity Level: ${request.activityLevel}

Goals & Preferences:
- Primary Goal: ${request.fitnessGoal}
- Experience Level: ${request.experienceLevel}
- Session Duration: ${request.sessionDuration} minutes
- Available Days: ${request.daysPerWeek} days per week

Please provide a JSON response with the following structure:
{
  "title": "Descriptive plan title",
  "description": "Brief overview of the plan",
  "weeklySchedule": [
    {
      "day": 1,
      "name": "Day 1 - Upper Body",
      "focus": "Chest, Back, Shoulders, Arms", 
      "duration": ${request.sessionDuration},
      "exercises": [
        {
          "name": "Specific exercise name",
          "sets": "3-4 sets",
          "reps": "8-12 reps", 
          "notes": "Form tips and modifications",
          "restTime": "60-90 seconds"
        }
      ]
    }
  ],
  "tips": ["Safety and progression tips"],
  "progressionNotes": "How to advance the plan over time"
}

Include 4-6 exercises per day with proper warm-up recommendations. Focus on compound movements for beginners and include isolation exercises for intermediate/advanced users. Ensure the plan is safe and progressive.`;
  }

  async generateNutritionAdvice(bmi: number, goal: string, calories: number): Promise<string> {
    if (!deepseek) {
      return 'Consult with a registered dietitian for personalized nutrition guidance.';
    }
    
    try {
      const response = await deepseek.chat.completions.create({
        model: "deepseek-chat", 
        messages: [
          {
            role: "system",
            content: "You are a certified nutritionist. Provide helpful, safe nutrition advice based on BMI and fitness goals."
          },
          {
            role: "user", 
            content: `Provide nutrition advice for someone with BMI ${bmi}, goal of ${goal}, and daily calorie target of ${calories}. Include meal timing, macronutrient ratios, and practical tips.`
          }
        ],
        max_tokens: 300
      });

      return response.choices[0].message.content || 'Unable to generate nutrition advice at this time.';
    } catch (error) {
      console.error('Error generating nutrition advice:', error);
      return 'Consult with a registered dietitian for personalized nutrition guidance.';
    }
  }
}

export const deepseekService = new DeepSeekService();
