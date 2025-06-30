import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Bot, Save, CheckCircle, Circle, Calendar } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { apiRequest } from '@/lib/queryClient';
import { getAuthHeaders } from '@/lib/auth';

interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  goal: string;
  experienceLevel: string;
  daysPerWeek: number;
  sessionDuration: number;
  planData: {
    weeklySchedule: Array<{
      day: number;
      name: string;
      focus: string;
      duration: number;
      exercises: Array<{
        name: string;
        sets: string;
        reps: string;
        notes: string;
        restTime: string;
      }>;
    }>;
    tips: string[];
    progressionNotes: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function WorkoutPlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [daysPerWeek, setDaysPerWeek] = useState('');
  const [sessionDuration, setSessionDuration] = useState('');
  const [completedExercises, setCompletedExercises] = useState<Set<string>>(new Set());

  // Fetch existing workout plans
  const { data: workoutPlans = [], isLoading: plansLoading } = useQuery({
    queryKey: ['/api/workout-plans'],
    queryFn: async () => {
      const response = await fetch('/api/workout-plans', {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error('Failed to fetch workout plans');
      return response.json();
    },
    enabled: !!user,
  });

  // Generate workout plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (planData: any) => {
      const response = await fetch('/api/workout-plans/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeaders(),
        },
        body: JSON.stringify(planData),
      });
      if (!response.ok) throw new Error('Failed to generate workout plan');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workout-plans'] });
      toast({
        title: "Workout Plan Generated",
        description: "Your personalized AI workout plan has been created!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate workout plan",
        variant: "destructive",
      });
    }
  });

  const handleGeneratePlan = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to generate workout plans",
        variant: "destructive",
      });
      return;
    }

    if (!height || !weight || !age || !gender || !activityLevel || !fitnessGoal || !experienceLevel || !daysPerWeek || !sessionDuration) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to generate your workout plan",
        variant: "destructive",
      });
      return;
    }

    generatePlanMutation.mutate({
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: parseInt(age),
      gender,
      activityLevel,
      fitnessGoal,
      experienceLevel,
      daysPerWeek: parseInt(daysPerWeek),
      sessionDuration: parseInt(sessionDuration)
    });
  };

  const toggleExerciseComplete = (exerciseKey: string) => {
    const newCompleted = new Set(completedExercises);
    if (newCompleted.has(exerciseKey)) {
      newCompleted.delete(exerciseKey);
    } else {
      newCompleted.add(exerciseKey);
    }
    setCompletedExercises(newCompleted);
  };

  const activePlan = workoutPlans.find((plan: WorkoutPlan) => plan.isActive);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="text-center">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access the AI-powered workout planner</p>
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
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Workout Planner</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized workout plans generated by AI based on your BMI, goals, and fitness level
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Plan Generation */}
            <div className="lg:col-span-1">
              <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Bot className="h-5 w-5 mr-2" />
                    Generate Your Plan
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleGeneratePlan} className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="plan-height" className="text-sm">Height (cm)</Label>
                        <Input
                          id="plan-height"
                          type="number"
                          placeholder="175"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plan-weight" className="text-sm">Weight (kg)</Label>
                        <Input
                          id="plan-weight"
                          type="number"
                          placeholder="70"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label htmlFor="plan-age" className="text-sm">Age</Label>
                        <Input
                          id="plan-age"
                          type="number"
                          placeholder="25"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <Label htmlFor="plan-gender" className="text-sm">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger className="text-sm">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="plan-activity" className="text-sm">Activity Level</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary</SelectItem>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="moderate">Moderate</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="very-active">Very Active</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="plan-goal" className="text-sm">Fitness Goal</Label>
                      <Select value={fitnessGoal} onValueChange={setFitnessGoal}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight-loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                          <SelectItem value="endurance">Endurance</SelectItem>
                          <SelectItem value="strength">Strength</SelectItem>
                          <SelectItem value="general-fitness">General Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="plan-experience" className="text-sm">Experience Level</Label>
                      <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="plan-days" className="text-sm">Available Days/Week</Label>
                      <Select value={daysPerWeek} onValueChange={setDaysPerWeek}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select days" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="3">3 days</SelectItem>
                          <SelectItem value="4">4 days</SelectItem>
                          <SelectItem value="5">5 days</SelectItem>
                          <SelectItem value="6">6 days</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="plan-duration" className="text-sm">Session Duration</Label>
                      <Select value={sessionDuration} onValueChange={setSessionDuration}>
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30">30 minutes</SelectItem>
                          <SelectItem value="45">45 minutes</SelectItem>
                          <SelectItem value="60">60 minutes</SelectItem>
                          <SelectItem value="90">90 minutes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={generatePlanMutation.isPending}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold"
                    >
                      {generatePlanMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Bot className="h-4 w-4 mr-2" />
                          Generate AI Plan
                        </>
                      )}
                    </Button>
                  </form>

                  <div className="mt-4 text-center text-sm text-gray-600">
                    <Bot className="inline h-4 w-4 mr-1" />
                    Powered by OpenAI GPT-4
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Generated Workout Plan */}
            <div className="lg:col-span-2">
              {plansLoading ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                    <p>Loading your workout plans...</p>
                  </CardContent>
                </Card>
              ) : activePlan ? (
                <Card className="border border-gray-100 shadow-lg">
                  <CardHeader className="border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle>{activePlan.title}</CardTitle>
                      <Badge variant="secondary">
                        <Save className="h-3 w-3 mr-1" />
                        Active Plan
                      </Badge>
                    </div>
                    <p className="text-gray-600">{activePlan.description}</p>
                  </CardHeader>

                  <CardContent className="p-6">
                    {/* Weekly Schedule */}
                    <div className="space-y-8">
                      {activePlan.planData.weeklySchedule.map((day, dayIndex) => (
                        <div key={dayIndex} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                              <Calendar className="h-4 w-4 mr-2" />
                              {day.name}
                            </h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-gray-600">{day.duration} min</span>
                              <Badge variant="outline">{day.focus}</Badge>
                            </div>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            {day.exercises.map((exercise, exerciseIndex) => {
                              const exerciseKey = `${dayIndex}-${exerciseIndex}`;
                              const isCompleted = completedExercises.has(exerciseKey);
                              
                              return (
                                <Card key={exerciseIndex} className={`transition-all ${isCompleted ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}>
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="flex-1">
                                        <h5 className={`font-medium mb-1 ${isCompleted ? 'text-green-800 line-through' : 'text-gray-900'}`}>
                                          {exercise.name}
                                        </h5>
                                        <p className="text-sm text-gray-600 mb-2">
                                          {exercise.sets} × {exercise.reps}
                                        </p>
                                        <p className="text-xs text-gray-500 mb-2">{exercise.notes}</p>
                                        <p className="text-xs text-blue-600">Rest: {exercise.restTime}</p>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => toggleExerciseComplete(exerciseKey)}
                                        className={`ml-3 ${isCompleted ? 'text-green-600' : 'text-gray-400'} hover:text-green-600`}
                                      >
                                        {isCompleted ? (
                                          <CheckCircle className="h-5 w-5" />
                                        ) : (
                                          <Circle className="h-5 w-5" />
                                        )}
                                      </Button>
                                    </div>
                                  </CardContent>
                                </Card>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Tips and Progression */}
                    {activePlan.planData.tips && activePlan.planData.tips.length > 0 && (
                      <Card className="bg-blue-50 border-blue-200 mt-8">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-blue-800 mb-2">💡 Training Tips</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            {activePlan.planData.tips.map((tip, index) => (
                              <li key={index}>• {tip}</li>
                            ))}
                          </ul>
                        </CardContent>
                      </Card>
                    )}

                    {activePlan.planData.progressionNotes && (
                      <Card className="bg-amber-50 border-amber-200 mt-4">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-amber-800 mb-2">📈 Progression Notes</h4>
                          <p className="text-sm text-amber-700">{activePlan.planData.progressionNotes}</p>
                        </CardContent>
                      </Card>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Bot className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Workout Plan</h3>
                    <p className="text-gray-600 mb-6">
                      Generate your first AI-powered workout plan by filling out the form on the left
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
