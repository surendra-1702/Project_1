import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import { 
  Bot, 
  Clock, 
  Target, 
  TrendingUp, 
  Calendar,
  Play,
  ChevronRight,
  Loader2,
  Star,
  Zap,
  Users,
  ArrowLeft
} from "lucide-react";

interface WorkoutPlan {
  id: number;
  title: string;
  description: string;
  goal: string;
  experienceLevel: string;
  daysPerWeek: number;
  sessionDuration: number;
  planData: {
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
  };
  isActive: boolean;
  createdAt: string;
}

export default function WorkoutPlanner() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    height: "",
    weight: "",
    age: "",
    gender: "",
    activityLevel: "",
    fitnessGoal: "",
    experienceLevel: "",
    daysPerWeek: "",
    sessionDuration: ""
  });

  // Fetch existing workout plans
  const { data: workoutPlans, isLoading: plansLoading } = useQuery({
    queryKey: ["/api/workout-plans"],
    enabled: !!user
  });

  // Generate workout plan mutation
  const generatePlanMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("/api/workout-plans/generate", {
        method: "POST",
        body: JSON.stringify(data)
      });
      return await response.json();
    },
    onSuccess: (newPlan) => {
      toast({
        title: "Workout Plan Generated!",
        description: "Your personalized AI workout plan is ready.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/workout-plans"] });
      setSelectedPlan(newPlan);
      setShowForm(false);
    },
    onError: (error: any) => {
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to generate workout plan. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const required = ['height', 'weight', 'age', 'gender', 'activityLevel', 'fitnessGoal', 'experienceLevel', 'daysPerWeek', 'sessionDuration'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    generatePlanMutation.mutate({
      height: parseInt(formData.height),
      weight: parseInt(formData.weight),
      age: parseInt(formData.age),
      gender: formData.gender,
      activityLevel: formData.activityLevel,
      fitnessGoal: formData.fitnessGoal,
      experienceLevel: formData.experienceLevel,
      daysPerWeek: parseInt(formData.daysPerWeek),
      sessionDuration: parseInt(formData.sessionDuration)
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <Card className="w-full max-w-md">
            <CardContent className="p-8 text-center">
              <Bot className="h-16 w-16 text-purple-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Sign In Required</h2>
              <p className="text-gray-600 mb-6">Please sign in to access the AI Workout Planner</p>
              <Link href="/auth">
                <Button className="w-full">Sign In</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (selectedPlan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => setSelectedPlan(null)}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Button>
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{selectedPlan.planData.title}</h1>
                <p className="text-gray-600 mt-2">{selectedPlan.planData.description}</p>
              </div>
              <Badge variant="default" className="text-sm">
                <Star className="h-4 w-4 mr-1" />
                AI Generated
              </Badge>
            </div>
          </div>

          {/* Plan Overview */}
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{selectedPlan.daysPerWeek}</div>
                <div className="text-sm text-gray-600">Days/Week</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <div className="text-2xl font-bold">{selectedPlan.sessionDuration}</div>
                <div className="text-sm text-gray-600">Minutes</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Target className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <div className="text-sm font-medium capitalize">{selectedPlan.goal.replace('-', ' ')}</div>
                <div className="text-sm text-gray-600">Goal</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <div className="text-sm font-medium capitalize">{selectedPlan.experienceLevel}</div>
                <div className="text-sm text-gray-600">Level</div>
              </CardContent>
            </Card>
          </div>

          {/* Weekly Schedule */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Weekly Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {selectedPlan.planData.weeklySchedule.map((day, index) => (
                  <div key={index} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-semibold">{day.name}</h3>
                        <p className="text-gray-600">{day.focus}</p>
                      </div>
                      <Badge variant="outline">{day.duration} min</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      {day.exercises.map((exercise, exerciseIndex) => (
                        <div key={exerciseIndex} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{exercise.name}</h4>
                            <div className="flex gap-2 text-sm text-gray-600">
                              <span>{exercise.sets}</span>
                              <span>•</span>
                              <span>{exercise.reps}</span>
                              <span>•</span>
                              <span>{exercise.restTime}</span>
                            </div>
                          </div>
                          {exercise.notes && (
                            <p className="text-sm text-gray-600">{exercise.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tips and Progression */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="h-5 w-5" />
                  Training Tips
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {selectedPlan.planData.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <ChevronRight className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{tip}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Progression Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-700">{selectedPlan.planData.progressionNotes}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
            <Bot className="h-8 w-8 text-purple-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Workout Planner</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Get personalized workout plans powered by artificial intelligence, tailored to your goals and fitness level.
          </p>
        </div>

        {/* Existing Plans */}
        {workoutPlans && workoutPlans.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Your Workout Plans</h2>
              <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Generate New Plan
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {workoutPlans.map((plan: WorkoutPlan) => (
                <Card key={plan.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{plan.title}</CardTitle>
                      {plan.isActive && (
                        <Badge variant="default" className="text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">{plan.description}</p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Goal:</span>
                        <span className="capitalize">{plan.goal.replace('-', ' ')}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Level:</span>
                        <span className="capitalize">{plan.experienceLevel}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Schedule:</span>
                        <span>{plan.daysPerWeek} days/week, {plan.sessionDuration} min</span>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => setSelectedPlan(plan)}
                      className="w-full"
                      variant="outline"
                    >
                      View Plan
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Generate New Plan Section */}
        {!showForm && (!workoutPlans || workoutPlans.length === 0) && (
          <div className="text-center">
            <Card className="max-w-md mx-auto">
              <CardContent className="p-8">
                <Bot className="h-16 w-16 text-purple-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Create Your First Plan</h3>
                <p className="text-gray-600 mb-6">Let AI create a personalized workout plan based on your goals and fitness level.</p>
                <Button onClick={() => setShowForm(true)} className="w-full">
                  <Bot className="h-4 w-4 mr-2" />
                  Generate Workout Plan
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Workout Plan Form */}
        {showForm && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                Generate AI Workout Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Physical Stats */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Physical Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="height">Height (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.height}
                        onChange={(e) => handleInputChange("height", e.target.value)}
                        placeholder="170"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="weight">Weight (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        value={formData.weight}
                        onChange={(e) => handleInputChange("weight", e.target.value)}
                        placeholder="70"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="age">Age</Label>
                      <Input
                        id="age"
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange("age", e.target.value)}
                        placeholder="25"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={formData.gender} onValueChange={(value) => handleInputChange("gender", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="male">Male</SelectItem>
                          <SelectItem value="female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Fitness Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fitness Goals</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="activityLevel">Activity Level</Label>
                      <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange("activityLevel", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                          <SelectItem value="light">Light (light exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (moderate exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (hard exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (very hard exercise, physical job)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="fitnessGoal">Primary Goal</Label>
                      <Select value={formData.fitnessGoal} onValueChange={(value) => handleInputChange("fitnessGoal", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your goal" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="weight-loss">Weight Loss</SelectItem>
                          <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                          <SelectItem value="strength">Strength Training</SelectItem>
                          <SelectItem value="endurance">Endurance</SelectItem>
                          <SelectItem value="general-fitness">General Fitness</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="experienceLevel">Experience Level</Label>
                      <Select value={formData.experienceLevel} onValueChange={(value) => handleInputChange("experienceLevel", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="beginner">Beginner</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Schedule */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Workout Schedule</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="daysPerWeek">Days Per Week</Label>
                      <Select value={formData.daysPerWeek} onValueChange={(value) => handleInputChange("daysPerWeek", value)}>
                        <SelectTrigger className="mt-1">
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
                      <Label htmlFor="sessionDuration">Session Duration (minutes)</Label>
                      <Select value={formData.sessionDuration} onValueChange={(value) => handleInputChange("sessionDuration", value)}>
                        <SelectTrigger className="mt-1">
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
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={generatePlanMutation.isPending}
                    className="flex-1"
                  >
                    {generatePlanMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Bot className="h-4 w-4 mr-2" />
                        Generate Plan
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}