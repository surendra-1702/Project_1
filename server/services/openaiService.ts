import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

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

export class OpenAIService {
  async generateWorkoutPlan(request: WorkoutPlanRequest): Promise<WorkoutPlanResponse> {
    try {
      const prompt = this.buildWorkoutPlanPrompt(request);

      const response = await openai.chat.completions.create({
        model: "gpt-4o",
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
        response_format: { type: "json_object" },
        temperature: 0.7
      });

      const result = JSON.parse(response.choices[0].message.content || '{}');
      return result as WorkoutPlanResponse;
    } catch (error) {
      console.error('Error generating workout plan:', error);
      throw new Error('Failed to generate workout plan. Please try again.');
    }
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
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", 
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

export const openaiService = new OpenAIService();
