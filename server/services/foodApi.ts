interface FoodSearchResult {
  food: {
    foodId: string;
    label: string;
    nutrients: {
      ENERC_KCAL: number; // Energy in kcal
      PROCNT?: number;    // Protein in g
      CHOCDF?: number;    // Total carbohydrate in g
      FAT?: number;       // Total lipid (fat) in g
      FIBTG?: number;     // Fiber in g
      SUGAR?: number;     // Sugars in g
    };
    category?: string;
    categoryLabel?: string;
  };
  measures: Array<{
    uri: string;
    label: string;
    weight: number;
  }>;
}

interface EdamamResponse {
  text: string;
  parsed: Array<{
    food: {
      foodId: string;
      label: string;
      nutrients: {
        ENERC_KCAL: number;
        PROCNT?: number;
        CHOCDF?: number;
        FAT?: number;
        FIBTG?: number;
        SUGAR?: number;
      };
      category?: string;
      categoryLabel?: string;
    };
    quantity: number;
    measure: {
      uri: string;
      label: string;
      weight: number;
    };
  }>;
  hints: FoodSearchResult[];
}

export class FoodApiService {
  private appId: string;
  private appKey: string;
  private baseUrl = 'https://api.edamam.com/api/food-database/v2';

  constructor() {
    this.appId = process.env.EDAMAM_APP_ID || '';
    this.appKey = process.env.EDAMAM_APP_KEY || '';
  }

  private getHeaders() {
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    };
  }

  async searchFood(query: string): Promise<FoodSearchResult[]> {
    if (!this.appId || !this.appKey) {
      throw new Error('Edamam API credentials not configured');
    }

    try {
      const url = new URL(`${this.baseUrl}/parser`);
      url.searchParams.append('app_id', this.appId);
      url.searchParams.append('app_key', this.appKey);
      url.searchParams.append('ingr', query);
      url.searchParams.append('nutrition-type', 'cooking');

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: this.getHeaders()
      });

      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status} ${response.statusText}`);
      }

      const data: EdamamResponse = await response.json();
      
      // Return both parsed results and hints
      const results: FoodSearchResult[] = [];
      
      // Add parsed results (exact matches)
      if (data.parsed && data.parsed.length > 0) {
        data.parsed.forEach(item => {
          results.push({
            food: item.food,
            measures: [item.measure]
          });
        });
      }
      
      // Add hints (suggestions)
      if (data.hints) {
        results.push(...data.hints);
      }

      return results;
    } catch (error) {
      console.error('Food API search error:', error);
      throw error;
    }
  }

  async getFoodNutrition(foodId: string, measureUri: string, quantity: number = 1): Promise<any> {
    if (!this.appId || !this.appKey) {
      throw new Error('Edamam API credentials not configured');
    }

    try {
      const url = new URL(`${this.baseUrl}/nutrients`);
      url.searchParams.append('app_id', this.appId);
      url.searchParams.append('app_key', this.appKey);

      const body = {
        ingredients: [{
          quantity: quantity,
          measureURI: measureUri,
          foodId: foodId
        }]
      };

      const response = await fetch(url.toString(), {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        throw new Error(`Edamam API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Food nutrition API error:', error);
      throw error;
    }
  }

  // Fallback method for basic calorie estimation when API is not available
  getFallbackNutrition(foodName: string, quantity: string): { calories: number; protein: number; carbs: number; fat: number } {
    // Basic food database with common items (calories per 100g)
    const basicFoods: Record<string, { calories: number; protein: number; carbs: number; fat: number }> = {
      'apple': { calories: 52, protein: 0.3, carbs: 14, fat: 0.2 },
      'banana': { calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
      'chicken breast': { calories: 165, protein: 31, carbs: 0, fat: 3.6 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3 },
      'bread': { calories: 265, protein: 9, carbs: 49, fat: 3.2 },
      'egg': { calories: 155, protein: 13, carbs: 1.1, fat: 11 },
      'milk': { calories: 42, protein: 3.4, carbs: 5, fat: 1 },
      'yogurt': { calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
      'salmon': { calories: 208, protein: 20, carbs: 0, fat: 13 },
      'broccoli': { calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
      'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1 },
      'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9 },
      'orange': { calories: 47, protein: 0.9, carbs: 12, fat: 0.1 },
      'potato': { calories: 77, protein: 2, carbs: 17, fat: 0.1 },
      'beef': { calories: 250, protein: 26, carbs: 0, fat: 15 }
    };

    const searchKey = foodName.toLowerCase();
    let baseNutrition = basicFoods[searchKey];
    
    // Try partial matches
    if (!baseNutrition) {
      for (const [key, value] of Object.entries(basicFoods)) {
        if (searchKey.includes(key) || key.includes(searchKey)) {
          baseNutrition = value;
          break;
        }
      }
    }

    // Default values if no match found
    if (!baseNutrition) {
      baseNutrition = { calories: 100, protein: 5, carbs: 15, fat: 3 };
    }

    // Parse quantity (assume 100g if no number specified)
    const quantityMatch = quantity.match(/(\d+)/);
    const amount = quantityMatch ? parseInt(quantityMatch[1]) : 100;
    const factor = amount / 100;

    return {
      calories: Math.round(baseNutrition.calories * factor),
      protein: Math.round(baseNutrition.protein * factor * 10) / 10,
      carbs: Math.round(baseNutrition.carbs * factor * 10) / 10,
      fat: Math.round(baseNutrition.fat * factor * 10) / 10
    };
  }
}

export const foodApiService = new FoodApiService();