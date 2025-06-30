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
  private baseUrl = 'https://exercisedb.p.rapidapi.com';

  constructor() {
    this.apiKey = process.env.RAPIDAPI_KEY || process.env.RAPID_API_KEY || '0e3a05e4c0msh3a58fa2b2bacbaep162600jsn4228aeea665f';
  }

  private getHeaders() {
    return {
      'x-rapidapi-key': this.apiKey,
      'x-rapidapi-host': 'exercisedb.p.rapidapi.com'
    };
  }

  async fetchExercises(limit = 10, offset = 0): Promise<ExerciseApiResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises`, {
        headers: this.getHeaders(),
        params: { limit: limit.toString(), offset: offset.toString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises:', error);
      throw new Error('Failed to fetch exercises from ExerciseDB API');
    }
  }

  async fetchExerciseById(id: string): Promise<ExerciseApiResponse> {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/exercise/${id}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercise by ID:', error);
      throw new Error(`Failed to fetch exercise with ID: ${id}`);
    }
  }

  async fetchBodyParts(): Promise<string[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/bodyPartList`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching body parts:', error);
      throw new Error('Failed to fetch body parts from ExerciseDB API');
    }
  }

  async fetchExercisesByBodyPart(bodyPart: string, limit = 10, offset = 0): Promise<ExerciseApiResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/bodyPart/${bodyPart}`, {
        headers: this.getHeaders(),
        params: { limit: limit.toString(), offset: offset.toString() }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by body part:', error);
      throw new Error(`Failed to fetch exercises for body part: ${bodyPart}`);
    }
  }

  async fetchExercisesByEquipment(equipment: string): Promise<ExerciseApiResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/equipment/${equipment}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by equipment:', error);
      throw new Error(`Failed to fetch exercises for equipment: ${equipment}`);
    }
  }

  async fetchExercisesByTarget(target: string): Promise<ExerciseApiResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/exercises/target/${target}`, {
        headers: this.getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching exercises by target:', error);
      throw new Error(`Failed to fetch exercises for target: ${target}`);
    }
  }
}

export const exerciseApiService = new ExerciseApiService();
