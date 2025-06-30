import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Loader2, Plus, Minus, ChevronLeft, ChevronRight, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { getAuthHeaders } from '@/lib/auth';
import { format, startOfDay, addDays, subDays } from 'date-fns';

interface FoodEntry {
  id: number;
  date: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  serving: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
}

const DAILY_CALORIE_GOAL = 2300;
const MACRO_GOALS = {
  protein: 115, // grams
  carbs: 288,   // grams
  fat: 77       // grams
};

export default function CalorieCounter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [newFood, setNewFood] = useState({
    meal: 'breakfast' as const,
    foodName: '',
    serving: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const dateString = format(selectedDate, 'yyyy-MM-dd');

  // Fetch food entries for selected date
  const { data: foodEntries = [], isLoading } = useQuery({
    queryKey: ['/api/food-entries', { date: dateString }],
    queryFn: async () => {
      const response = await fetch(`/api/food-entries?date=${dateString}`, {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch food entries');
      return response.json();
    },
    enabled: !!user,
  });

  // Add food entry mutation
  const addFoodMutation = useMutation({
    mutationFn: async (foodData: any) => {
      const response = await fetch('/api/food-entries', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({
          ...foodData,
          date: selectedDate.toISOString(),
        }),
      });
      if (!response.ok) throw new Error('Failed to add food entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-entries'] });
      setNewFood({
        meal: 'breakfast',
        foodName: '',
        serving: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      });
      toast({
        title: "Food Added",
        description: "Food entry has been added to your log",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Add Food",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Delete food entry mutation
  const deleteFoodMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const response = await fetch(`/api/food-entries/${entryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete food entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-entries'] });
      toast({
        title: "Food Removed",
        description: "Food entry has been removed from your log",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Remove Food",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAddFood = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFood.foodName || !newFood.serving || !newFood.calories) {
      toast({
        title: "Missing Information",
        description: "Please fill in food name, serving, and calories",
        variant: "destructive",
      });
      return;
    }

    addFoodMutation.mutate({
      meal: newFood.meal,
      foodName: newFood.foodName,
      serving: newFood.serving,
      calories: parseInt(newFood.calories),
      protein: newFood.protein ? parseFloat(newFood.protein) : null,
      carbs: newFood.carbs ? parseFloat(newFood.carbs) : null,
      fat: newFood.fat ? parseFloat(newFood.fat) : null,
    });
  };

  // Calculate daily totals
  const dailyTotals = foodEntries.reduce(
    (totals, entry: FoodEntry) => ({
      calories: totals.calories + entry.calories,
      protein: totals.protein + (entry.protein || 0),
      carbs: totals.carbs + (entry.carbs || 0),
      fat: totals.fat + (entry.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  // Group entries by meal
  const mealGroups = foodEntries.reduce((groups: Record<string, FoodEntry[]>, entry: FoodEntry) => {
    const meal = entry.meal;
    if (!groups[meal]) groups[meal] = [];
    groups[meal].push(entry);
    return groups;
  }, {});

  const caloriesRemaining = DAILY_CALORIE_GOAL - dailyTotals.calories;
  const caloriesProgress = Math.min((dailyTotals.calories / DAILY_CALORIE_GOAL) * 100, 100);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access the calorie counter</p>
              <Button asChild>
                <a href="/auth">Sign In</a>
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Calorie Counter & Nutrition Tracker</h1>
            <p className="text-xl text-gray-600">Track your daily food intake and stay within your calorie goals</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Daily Overview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Today's Progress</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Calorie Progress Circle */}
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none"></circle>
                        <circle 
                          cx="50" 
                          cy="50" 
                          r="40" 
                          stroke="#3b82f6" 
                          strokeWidth="8" 
                          fill="none"
                          strokeDasharray="251.2" 
                          strokeDashoffset={251.2 - (caloriesProgress / 100) * 251.2}
                          strokeLinecap="round"
                        ></circle>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{dailyTotals.calories}</div>
                          <div className="text-xs text-gray-600">/ {DAILY_CALORIE_GOAL}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm ${caloriesRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {caloriesRemaining >= 0 ? `${caloriesRemaining} calories remaining` : `${Math.abs(caloriesRemaining)} calories over`}
                    </div>
                  </div>

                  {/* Macronutrients */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Protein</span>
                        <span className="font-medium">{Math.round(dailyTotals.protein)}g / {MACRO_GOALS.protein}g</span>
                      </div>
                      <Progress value={(dailyTotals.protein / MACRO_GOALS.protein) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Carbs</span>
                        <span className="font-medium">{Math.round(dailyTotals.carbs)}g / {MACRO_GOALS.carbs}g</span>
                      </div>
                      <Progress value={(dailyTotals.carbs / MACRO_GOALS.carbs) * 100} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-700">Fat</span>
                        <span className="font-medium">{Math.round(dailyTotals.fat)}g / {MACRO_GOALS.fat}g</span>
                      </div>
                      <Progress value={(dailyTotals.fat / MACRO_GOALS.fat) * 100} className="h-2" />
                    </div>
                  </div>

                  {/* Quick Add */}
                  <div className="pt-6 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-3">Quick Add Food</h4>
                    <form onSubmit={handleAddFood} className="space-y-3">
                      <Select value={newFood.meal} onValueChange={(value: any) => setNewFood({...newFood, meal: value})}>
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="breakfast">Breakfast</SelectItem>
                          <SelectItem value="lunch">Lunch</SelectItem>
                          <SelectItem value="dinner">Dinner</SelectItem>
                          <SelectItem value="snack">Snack</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Input
                        placeholder="Food name (e.g., banana, chicken breast)"
                        value={newFood.foodName}
                        onChange={(e) => setNewFood({...newFood, foodName: e.target.value})}
                        className="text-sm"
                      />
                      
                      <Input
                        placeholder="Serving (e.g., 1 cup, 100g)"
                        value={newFood.serving}
                        onChange={(e) => setNewFood({...newFood, serving: e.target.value})}
                        className="text-sm"
                      />
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Calories"
                          value={newFood.calories}
                          onChange={(e) => setNewFood({...newFood, calories: e.target.value})}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Protein (g)"
                          value={newFood.protein}
                          onChange={(e) => setNewFood({...newFood, protein: e.target.value})}
                          className="text-sm"
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Carbs (g)"
                          value={newFood.carbs}
                          onChange={(e) => setNewFood({...newFood, carbs: e.target.value})}
                          className="text-sm"
                        />
                        <Input
                          type="number"
                          placeholder="Fat (g)"
                          value={newFood.fat}
                          onChange={(e) => setNewFood({...newFood, fat: e.target.value})}
                          className="text-sm"
                        />
                      </div>
                      
                      <Button
                        type="submit"
                        disabled={addFoodMutation.isPending}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {addFoodMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Plus className="h-4 w-4 mr-1" />
                        )}
                        Add Food
                      </Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Food Log */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader className="border-b">
                  <div className="flex items-center justify-between">
                    <CardTitle>Food Log</CardTitle>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDate(subDays(selectedDate, 1))}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-gray-900 min-w-[120px] text-center">
                        {format(selectedDate, 'MMM dd, yyyy')}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedDate(addDays(selectedDate, 1))}
                        disabled={selectedDate >= startOfDay(new Date())}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-12">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Loading food entries...</span>
                    </div>
                  ) : (
                    <div className="space-y-8">
                      {/* Meal Sections */}
                      {['breakfast', 'lunch', 'dinner', 'snack'].map((mealType) => (
                        <div key={mealType} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 capitalize">{mealType}</h4>
                            <div className="text-sm text-gray-600">
                              {mealGroups[mealType]?.reduce((sum, entry) => sum + entry.calories, 0) || 0} calories
                            </div>
                          </div>

                          <div className="space-y-3">
                            {mealGroups[mealType]?.map((entry: FoodEntry) => (
                              <Card key={entry.id} className="bg-gray-50">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                      <div className="font-medium text-gray-900">{entry.foodName}</div>
                                      <div className="text-sm text-gray-600">{entry.serving}</div>
                                    </div>
                                    <div className="text-right mr-4">
                                      <div className="font-medium text-gray-900">{entry.calories} cal</div>
                                      <div className="text-sm text-gray-600">
                                        P: {Math.round(entry.protein || 0)}g | 
                                        C: {Math.round(entry.carbs || 0)}g | 
                                        F: {Math.round(entry.fat || 0)}g
                                      </div>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => deleteFoodMutation.mutate(entry.id)}
                                      className="text-gray-400 hover:text-red-600"
                                    >
                                      <Minus className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            )) || (
                              <div className="text-center py-4 text-gray-500 text-sm">
                                No food entries for {mealType}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {/* Daily Summary */}
                      <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-none">
                        <CardContent className="p-6">
                          <h4 className="font-semibold text-gray-900 mb-4 flex items-center">
                            <TrendingUp className="h-4 w-4 mr-2" />
                            Daily Summary
                          </h4>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                            <div>
                              <div className="text-2xl font-bold text-blue-600">{dailyTotals.calories}</div>
                              <div className="text-xs text-gray-600">Calories</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-red-600">{Math.round(dailyTotals.protein)}g</div>
                              <div className="text-xs text-gray-600">Protein</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-yellow-600">{Math.round(dailyTotals.carbs)}g</div>
                              <div className="text-xs text-gray-600">Carbs</div>
                            </div>
                            <div>
                              <div className="text-2xl font-bold text-green-600">{Math.round(dailyTotals.fat)}g</div>
                              <div className="text-xs text-gray-600">Fat</div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
