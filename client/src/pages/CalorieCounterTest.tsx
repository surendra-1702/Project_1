import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Minus, Utensils } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

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

export default function CalorieCounterTest() {
  const mealTypes = [
    { key: 'breakfast', label: 'Breakfast', icon: '🌅' },
    { key: 'lunch', label: 'Lunch', icon: '☀️' },
    { key: 'dinner', label: 'Dinner', icon: '🌙' },
    { key: 'snack', label: 'Snacks', icon: '🍎' }
  ];

  const mealGroups: Record<string, FoodEntry[]> = {
    breakfast: [],
    lunch: [],
    dinner: [],
    snack: []
  };

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
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="glass-card-dark border border-red-600/20 hover-glow sticky top-24">
                <div className="p-6">
                  <h3 className="text-2xl font-black text-white text-athletic uppercase tracking-wide">DAILY PROGRESS</h3>
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
                              onClick={() => console.log('delete', entry.id)}
                              disabled={false}
                            >
                              <Minus className="w-4 h-4" />
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