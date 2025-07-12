import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Loader2, Plus, Minus, Search, Target, RotateCcw, Calendar, Utensils, TrendingUp, CheckCircle } from 'lucide-react';
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

interface FoodSearchResult {
  food: {
    foodId: string;
    label: string;
    nutrients: {
      ENERC_KCAL: number;
      PROCNT?: number;
      CHOCDF?: number;
      FAT?: number;
    };
    category?: string;
  };
  measures: Array<{
    uri: string;
    label: string;
    weight: number;
  }>;
}

export default function CalorieCounter() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(user?.dailyCalorieGoal || 2000);
  const [showGoalDialog, setShowGoalDialog] = useState(false);
  const [showFoodDialog, setShowFoodDialog] = useState(false);
  
  // Food search and entry state
  const [foodSearch, setFoodSearch] = useState('');
  const [searchResults, setSearchResults] = useState<FoodSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodSearchResult | null>(null);
  const [selectedMeal, setSelectedMeal] = useState<'breakfast' | 'lunch' | 'dinner' | 'snack'>('breakfast');
  const [quantity, setQuantity] = useState('100');
  const [selectedMeasure, setSelectedMeasure] = useState<string>('');
  const [isLoggingDay, setIsLoggingDay] = useState(false);

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

  // Food search function
  const searchFood = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(`/api/food/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Failed to search foods');
      const results = await response.json();
      setSearchResults(results.slice(0, 10)); // Limit to 10 results
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not search for foods. Please try again.",
        variant: "destructive",
      });
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (foodSearch) {
        searchFood(foodSearch);
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [foodSearch]);

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
      setShowFoodDialog(false);
      setSelectedFood(null);
      setFoodSearch('');
      setSearchResults([]);
      setQuantity('100');
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

  // Update daily calorie goal mutation
  const updateGoalMutation = useMutation({
    mutationFn: async (newGoal: number) => {
      const response = await fetch(`/api/users/${user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify({ dailyCalorieGoal: newGoal }),
      });
      if (!response.ok) throw new Error('Failed to update calorie goal');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      setShowGoalDialog(false);
      toast({
        title: "Goal Updated",
        description: "Your daily calorie goal has been updated",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to Update Goal",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  const handleAddFood = async () => {
    if (!selectedFood) return;

    const selectedMeasureObj = selectedFood.measures.find(m => m.uri === selectedMeasure) || selectedFood.measures[0];
    const quantityNum = parseFloat(quantity) || 100;
    
    // Calculate nutrition based on quantity and measure
    const baseNutrients = selectedFood.food.nutrients;
    const weightFactor = selectedMeasureObj ? (quantityNum * selectedMeasureObj.weight) / 100 : quantityNum / 100;
    
    const calories = Math.round(baseNutrients.ENERC_KCAL * weightFactor);
    const protein = baseNutrients.PROCNT ? Math.round(baseNutrients.PROCNT * weightFactor * 10) / 10 : null;
    const carbs = baseNutrients.CHOCDF ? Math.round(baseNutrients.CHOCDF * weightFactor * 10) / 10 : null;
    const fat = baseNutrients.FAT ? Math.round(baseNutrients.FAT * weightFactor * 10) / 10 : null;

    const servingText = selectedMeasureObj ? `${quantity} ${selectedMeasureObj.label.toLowerCase()}` : `${quantity}g`;

    addFoodMutation.mutate({
      meal: selectedMeal,
      foodName: selectedFood.food.label,
      serving: servingText,
      calories,
      protein,
      carbs,
      fat,
    });
  };

  const handleUpdateGoal = () => {
    if (dailyCalorieGoal < 800 || dailyCalorieGoal > 5000) {
      toast({
        title: "Invalid Goal",
        description: "Daily calorie goal should be between 800 and 5000 calories",
        variant: "destructive",
      });
      return;
    }
    updateGoalMutation.mutate(dailyCalorieGoal);
  };

  const resetDayData = () => {
    foodEntries.forEach((entry: FoodEntry) => {
      deleteFoodMutation.mutate(entry.id);
    });
  };

  // Log daily calories with achievement feedback
  const logDayCalories = () => {
    setIsLoggingDay(true);
    
    setTimeout(() => {
      const totalCalories = dailyTotals.calories;
      const percentageConsumed = (totalCalories / currentGoal) * 100;
      
      let message = "";
      let title = "";
      
      if (percentageConsumed >= 90 && percentageConsumed <= 110) {
        title = "🎉 Congratulations!";
        message = "You achieved your calorie goal for the day! Great job maintaining your nutrition targets.";
      } else if (percentageConsumed > 110) {
        title = "⚠️ You Went Overboard";
        message = `You consumed ${Math.round(totalCalories - currentGoal)} calories more than your goal. Consider lighter meals tomorrow.`;
      } else {
        title = "💪 Try Doing Better";
        message = `You're ${Math.round(currentGoal - totalCalories)} calories short of your goal. Make sure you're eating enough to fuel your body.`;
      }
      
      toast({
        title,
        description: message,
        duration: 5000,
      });
      
      setIsLoggingDay(false);
    }, 1000);
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

  const currentGoal = user?.dailyCalorieGoal || dailyCalorieGoal;
  const caloriesRemaining = currentGoal - dailyTotals.calories;
  const caloriesProgress = Math.min((dailyTotals.calories / currentGoal) * 100, 100);

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snacks', icon: '🍎' }
  ];

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
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Smart Calorie Counter</h1>
            <p className="text-xl text-gray-600">Track your daily nutrition with automatic food lookup</p>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(subDays(selectedDate, 1))}>
              <Calendar className="w-4 h-4 mr-2" />
              Previous
            </Button>
            <div className="text-lg font-semibold">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            <Button variant="outline" size="sm" onClick={() => setSelectedDate(addDays(selectedDate, 1))}>
              Next
              <Calendar className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Daily Overview */}
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Daily Progress</CardTitle>
                    <Dialog open={showGoalDialog} onOpenChange={setShowGoalDialog}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Target className="w-4 h-4 mr-2" />
                          Set Goal
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Set Daily Calorie Goal</DialogTitle>
                          <DialogDescription>
                            Set your personalized daily calorie target to track your nutrition goals.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="calorie-goal">Daily Calorie Goal</Label>
                            <Input
                              id="calorie-goal"
                              type="number"
                              value={dailyCalorieGoal}
                              onChange={(e) => setDailyCalorieGoal(parseInt(e.target.value) || 2000)}
                              placeholder="2000"
                              min="800"
                              max="5000"
                            />
                            <p className="text-sm text-gray-600 mt-1">Recommended: 1500-2500 calories per day</p>
                          </div>
                          <Button onClick={handleUpdateGoal} disabled={updateGoalMutation.isPending}>
                            {updateGoalMutation.isPending ? (
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            ) : null}
                            Update Goal
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
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
                          <div className="text-xs text-gray-600">/ {currentGoal}</div>
                        </div>
                      </div>
                    </div>
                    <div className={`text-sm font-medium ${caloriesRemaining >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {caloriesRemaining >= 0 ? `${caloriesRemaining} calories remaining` : `${Math.abs(caloriesRemaining)} calories over`}
                    </div>
                  </div>

                  {/* Macronutrients */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Macronutrients</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-blue-600">{Math.round(dailyTotals.protein)}g</div>
                        <div className="text-xs text-gray-600">Protein</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{Math.round(dailyTotals.carbs)}g</div>
                        <div className="text-xs text-gray-600">Carbs</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">{Math.round(dailyTotals.fat)}g</div>
                        <div className="text-xs text-gray-600">Fat</div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <Dialog open={showFoodDialog} onOpenChange={setShowFoodDialog}>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Food
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Add Food Entry</DialogTitle>
                          <DialogDescription>
                            Search for foods and add them to your daily nutrition log with automatic calorie calculation.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          {/* Meal Selection */}
                          <div>
                            <Label>Meal</Label>
                            <Select value={selectedMeal} onValueChange={(value: any) => setSelectedMeal(value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="breakfast">Breakfast</SelectItem>
                                <SelectItem value="lunch">Lunch</SelectItem>
                                <SelectItem value="dinner">Dinner</SelectItem>
                                <SelectItem value="snack">Snack</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {/* Food Search */}
                          <div>
                            <Label>Search Food</Label>
                            <div className="relative">
                              <Input
                                placeholder="Type food name (e.g., banana, chicken breast)"
                                value={foodSearch}
                                onChange={(e) => setFoodSearch(e.target.value)}
                              />
                              <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
                            </div>
                            {isSearching && (
                              <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Searching foods...
                              </div>
                            )}
                          </div>

                          {/* Search Results */}
                          {searchResults.length > 0 && (
                            <div className="space-y-2">
                              <Label>Select Food</Label>
                              <div className="max-h-48 overflow-y-auto space-y-1">
                                {searchResults.map((result, index) => (
                                  <div
                                    key={index}
                                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                                      selectedFood?.food.foodId === result.food.foodId
                                        ? 'bg-blue-50 border-blue-300'
                                        : 'hover:bg-gray-50'
                                    }`}
                                    onClick={() => {
                                      setSelectedFood(result);
                                      setSelectedMeasure(result.measures[0]?.uri || '');
                                    }}
                                  >
                                    <div className="font-medium">{result.food.label}</div>
                                    <div className="text-sm text-gray-600">
                                      {result.food.nutrients.ENERC_KCAL} cal per 100g
                                      {result.food.category && (
                                        <Badge variant="secondary" className="ml-2 text-xs">
                                          {result.food.category}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Quantity and Measure */}
                          {selectedFood && (
                            <div className="space-y-4">
                              <Separator />
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Quantity</Label>
                                  <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    placeholder="100"
                                    min="1"
                                  />
                                </div>
                                <div>
                                  <Label>Unit</Label>
                                  <Select value={selectedMeasure} onValueChange={setSelectedMeasure}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {selectedFood.measures.map((measure) => (
                                        <SelectItem key={measure.uri} value={measure.uri}>
                                          {measure.label}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>

                              {/* Nutrition Preview */}
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <h4 className="font-medium mb-2">Nutrition Preview</h4>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                  <div>Calories: <span className="font-medium">
                                    {Math.round(selectedFood.food.nutrients.ENERC_KCAL * 
                                      ((parseFloat(quantity) || 100) * (selectedFood.measures.find(m => m.uri === selectedMeasure)?.weight || 1)) / 100
                                    )}
                                  </span></div>
                                  {selectedFood.food.nutrients.PROCNT && (
                                    <div>Protein: <span className="font-medium">
                                      {Math.round(selectedFood.food.nutrients.PROCNT * 
                                        ((parseFloat(quantity) || 100) * (selectedFood.measures.find(m => m.uri === selectedMeasure)?.weight || 1)) / 100 * 10
                                      ) / 10}g
                                    </span></div>
                                  )}
                                </div>
                              </div>

                              <Button onClick={handleAddFood} disabled={addFoodMutation.isPending} className="w-full">
                                {addFoodMutation.isPending ? (
                                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4 mr-2" />
                                )}
                                Add to {selectedMeal}
                              </Button>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    <div className="flex gap-2">
                      <Button variant="outline" onClick={resetDayData} className="flex-1">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reset Day
                      </Button>
                      <Button 
                        onClick={logDayCalories} 
                        disabled={isLoggingDay || dailyTotals.calories === 0} 
                        className="flex-1"
                      >
                        {isLoggingDay ? (
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <CheckCircle className="w-4 h-4 mr-2" />
                        )}
                        Log Day
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Food Entries */}
            <div className="lg:col-span-2 space-y-6">
              {mealTypes.map(({ key, label, icon }) => (
                <Card key={key}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">{icon}</span>
                      {label}
                      <Badge variant="secondary" className="ml-auto">
                        {mealGroups[key]?.reduce((total, entry) => total + entry.calories, 0) || 0} cal
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {mealGroups[key]?.length > 0 ? (
                      <div className="space-y-3">
                        {mealGroups[key].map((entry: FoodEntry) => (
                          <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex-1">
                              <div className="font-medium">{entry.foodName}</div>
                              <div className="text-sm text-gray-600">
                                {entry.serving} • {entry.calories} calories
                                {entry.protein && ` • ${entry.protein}g protein`}
                                {entry.carbs && ` • ${entry.carbs}g carbs`}
                                {entry.fat && ` • ${entry.fat}g fat`}
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteFoodMutation.mutate(entry.id)}
                              disabled={deleteFoodMutation.isPending}
                            >
                              {deleteFoodMutation.isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                              ) : (
                                <Minus className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p>No food logged for {label.toLowerCase()}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
}