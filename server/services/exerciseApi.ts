import axios from 'axios';

interface ExerciseApiResponse {
  bodyPart: string;
  equipment: string;
  gifUrl: string;
  id: string;
  name: string;
  target: string;
  secondaryMuscles: string[];
  instructions: string[];
}

export class ExerciseApiService {
  private apiKey: string;
  private rapidApiUrl = 'https://exercisedb.p.rapidapi.com';
  private freeApiUrl = 'https://exercisedb-api.vercel.app/api/v1';

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY || '0e3a05e4c0msh3a58fa2b2bacbaep162600jsn4228aeea665f';
  }

  private getRapidApiHeaders() {
    return {
      'X-RapidAPI-Key': this.apiKey,
      'X-RapidAPI-Host': 'exercisedb.p.rapidapi.com'
    };
  }

  private async makeRequest(rapidApiEndpoint: string, freeApiEndpoint: string, params?: any): Promise<any> {
    // Use free API directly since RapidAPI endpoints are not working
    try {
      const response = await axios.get(`${this.freeApiUrl}${freeApiEndpoint}`, { params });
      
      // Handle response structure from free API
      const data = response.data;
      if (data.success && data.data) {
        // Free API returns exercises in data.exercises array
        if (data.data.exercises) {
          return data.data.exercises.map((exercise: any) => ({
            id: exercise.exerciseId,
            name: exercise.name,
            bodyPart: exercise.bodyParts?.[0] || 'unknown',
            target: exercise.targetMuscles?.[0] || 'unknown',
            equipment: exercise.equipments?.[0] || 'unknown',
            gifUrl: exercise.gifUrl,
            instructions: exercise.instructions,
            secondaryMuscles: exercise.secondaryMuscles || []
          }));
        }
        // For other endpoints that return different structures
        if (Array.isArray(data.data)) {
          return data.data;
        }
        return data.data;
      }
      return data;
    } catch (freeApiError: any) {
      console.error('Free ExerciseDB API failed:', freeApiError.response?.status);
      throw new Error('Failed to fetch from ExerciseDB API');
    }
  }

  async fetchExercises(limit = 10, offset = 0): Promise<ExerciseApiResponse[]> {
    return this.makeRequest('/exercises', '/exercises', { limit, offset });
  }

  async fetchExerciseById(id: string): Promise<ExerciseApiResponse> {
    return this.makeRequest(`/exercises/${id}`, `/exercises/${id}`);
  }

  async fetchBodyParts(): Promise<string[]> {
    return this.makeRequest('/bodyPartList', '/bodyparts');
  }

  async fetchExercisesByBodyPart(bodyPart: string, limit = 10, offset = 0): Promise<ExerciseApiResponse[]> {
    return this.makeRequest(`/exercises/bodyPart/${bodyPart}`, `/exercises/bodypart/${bodyPart}`, { limit, offset });
  }

  async fetchExercisesByEquipment(equipment: string): Promise<ExerciseApiResponse[]> {
    return this.makeRequest(`/exercises/equipment/${equipment}`, `/exercises/equipment/${equipment}`);
  }

  async fetchExercisesByTarget(target: string): Promise<ExerciseApiResponse[]> {
    return this.makeRequest(`/exercises/target/${target}`, `/exercises/target/${target}`);
  }
}

export const exerciseApiService = new ExerciseApiService();
