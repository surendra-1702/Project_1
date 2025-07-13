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
    enabled: !!user
  });
  // Group food entries by meal type
  const mealGroups = foodEntries.reduce((groups: Record<string, FoodEntry[]>, entry: FoodEntry) => {
    const meal = entry.meal;
    if (!groups[meal]) {
      groups[meal] = [];
    }
    groups[meal].push(entry);
    return groups;
  }, {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  });

  // Calculate daily totals
  const dailyTotals = foodEntries.reduce((totals, entry) => ({
    calories: totals.calories + entry.calories,
    protein: totals.protein + (entry.protein || 0),
    carbs: totals.carbs + (entry.carbs || 0),
    fat: totals.fat + (entry.fat || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const currentGoal = dailyCalorieGoal;
  const caloriesRemaining = currentGoal - dailyTotals.calories;
  const caloriesProgress = Math.min((dailyTotals.calories / currentGoal) * 100, 100);

  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snacks', icon: '🍎' }
  ];

  // Delete food entry mutation
  const deleteFoodMutation = useMutation({
    mutationFn: async (entryId: number) => {
      const response = await fetch(`/api/food-entries/${entryId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete food entry');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/food-entries'] });
      toast({
        title: "Success",
        description: "Food entry deleted successfully"
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete food entry"
      });
    }
  });

  if (!user) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="glass-card-dark border border-red-600/20 text-center hover-glow">
            <div className="p-12">
              <h2 className="text-4xl font-black text-white mb-6 text-athletic uppercase tracking-wide">ACCESS DENIED</h2>
              <p className="text-gray-300 mb-8 text-xl">Sign in to access the calorie crusher</p>
              <Button asChild className="btn-primary font-black uppercase tracking-wide text-xl px-8 py-4">
                <a href="/auth">SIGN IN</a>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      <section className="py-24 bg-gradient-to-br from-black via-gray-900 to-black relative">
        <div className="absolute inset-0 bg-red-600/5"></div>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-7xl font-black text-white mb-6 text-athletic uppercase tracking-tight">
              CALORIE <span className="text-energy">CRUSHER</span>
            </h1>
            <p className="text-2xl text-gray-300 font-medium max-w-4xl mx-auto">Track your daily nutrition with automatic food lookup and macro domination</p>
          </div>

          {/* Date Navigation */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <Button variant="outline" size="lg" onClick={() => setSelectedDate(subDays(selectedDate, 1))} className="bg-black/50 border-red-600/30 text-white hover:bg-red-600/20 font-bold uppercase tracking-wide">
              <Calendar className="w-5 h-5 mr-2" />
              PREVIOUS
            </Button>
            <div className="text-2xl font-black text-white text-athletic uppercase tracking-wide">
              {format(selectedDate, 'EEEE, MMMM d, yyyy')}
            </div>
            <Button variant="outline" size="lg" onClick={() => setSelectedDate(addDays(selectedDate, 1))} className="bg-black/50 border-red-600/30 text-white hover:bg-red-600/20 font-bold uppercase tracking-wide">
              NEXT
              <Calendar className="w-5 h-5 ml-2" />
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card-dark border border-red-600/20 hover-glow sticky top-24">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-2xl font-black text-white text-athletic uppercase tracking-wide">DAILY PROGRESS</h3>
                    <Button variant="outline" size="sm" className="bg-red-600/20 border-red-600/30 text-red-400 hover:bg-red-600 hover:text-white font-bold uppercase tracking-wide">
                      <Target className="w-4 h-4 mr-2" />
                      SET GOAL
                    </Button>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Calorie Progress Circle */}
                    <div className="text-center">
                      <div className="relative w-32 h-32 mx-auto mb-4">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="#e5e7eb" strokeWidth="8" fill="none"></circle>
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke="#dc2626" 
                            strokeWidth="8" 
                            fill="none"
                            strokeDasharray="251.2" 
                            strokeDashoffset={251.2 - (caloriesProgress / 100) * 251.2}
                            strokeLinecap="round"
                          ></circle>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-white">{dailyTotals.calories}</div>
                            <div className="text-xs text-gray-400">/ {currentGoal}</div>
                          </div>
                        </div>
                      </div>
                      <div className={`text-sm font-medium ${caloriesRemaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {caloriesRemaining >= 0 ? `${caloriesRemaining} calories remaining` : `${Math.abs(caloriesRemaining)} calories over`}
                      </div>
                    </div>

                    {/* Macronutrients */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-white">Macronutrients</h4>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-400">{Math.round(dailyTotals.protein)}g</div>
                          <div className="text-xs text-gray-400">Protein</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-400">{Math.round(dailyTotals.carbs)}g</div>
                          <div className="text-xs text-gray-400">Carbs</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-orange-400">{Math.round(dailyTotals.fat)}g</div>
                          <div className="text-xs text-gray-400">Fat</div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="space-y-2">
                      <Button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wide">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Food
                      </Button>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" className="flex-1 bg-black/50 border-red-600/30 text-white hover:bg-red-600/20 font-bold uppercase tracking-wide">
                          <RotateCcw className="w-4 h-4 mr-2" />
                          Reset Day
                        </Button>
                        <Button 
                          disabled={dailyTotals.calories === 0} 
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold uppercase tracking-wide"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Log Day
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

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
                              className="hover:bg-red-600/20 hover:text-red-400"
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