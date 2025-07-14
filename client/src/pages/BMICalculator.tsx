import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calculator, TrendingUp } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface BMIResult {
  bmi: number;
  category: string;
  bmr: number;
  tdee: number;
  recommendations: {
    weightLoss: number;
    maintenance: number;
    weightGain: number;
  };
}

export default function BMICalculator() {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [activityLevel, setActivityLevel] = useState('');
  const [result, setResult] = useState<BMIResult | null>(null);
  const { toast } = useToast();

  const calculateBMIMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('/api/bmi/calculate', {
        method: 'POST',
        body: JSON.stringify(data)
      });
      return response.json();
    },
    onSuccess: (data) => {
      setResult(data);
      toast({
        title: "BMI Calculated",
        description: `Your BMI is ${data.bmi} (${data.category})`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Calculation Failed",
        description: error.message || "Failed to calculate BMI",
        variant: "destructive",
      });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!height || !weight || !age || !gender || !activityLevel) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields to calculate your BMI",
        variant: "destructive",
      });
      return;
    }

    calculateBMIMutation.mutate({
      height: parseFloat(height),
      weight: parseFloat(weight),
      age: parseInt(age),
      gender,
      activityLevel
    });
  };

  const getBMIColor = (bmi: number) => {
    if (bmi < 18.5) return 'text-blue-600';
    if (bmi < 25) return 'text-green-600';
    if (bmi < 30) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBMIPosition = (bmi: number) => {
    const position = Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100);
    return `${position}%`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">BMI Calculator & Recommendations</h1>
            <p className="text-xl text-gray-600">Get personalized health insights and calorie recommendations based on your BMI</p>
          </div>

          <Card className="bg-white rounded-2xl shadow-xl">
            <CardContent className="p-8">
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Input Form */}
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <Calculator className="h-5 w-5 mr-2" />
                    Enter Your Details
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="height">Height (cm)</Label>
                        <Input
                          id="height"
                          type="number"
                          placeholder="175"
                          value={height}
                          onChange={(e) => setHeight(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="weight">Weight (kg)</Label>
                        <Input
                          id="weight"
                          type="number"
                          placeholder="70"
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="age">Age</Label>
                        <Input
                          id="age"
                          type="number"
                          placeholder="25"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender">Gender</Label>
                        <Select value={gender} onValueChange={setGender}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="activity">Activity Level</Label>
                      <Select value={activityLevel} onValueChange={setActivityLevel}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select activity level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sedentary">Sedentary (little/no exercise)</SelectItem>
                          <SelectItem value="light">Light (exercise 1-3 days/week)</SelectItem>
                          <SelectItem value="moderate">Moderate (exercise 3-5 days/week)</SelectItem>
                          <SelectItem value="active">Active (exercise 6-7 days/week)</SelectItem>
                          <SelectItem value="very-active">Very Active (2x/day or intense exercise)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      type="submit"
                      disabled={calculateBMIMutation.isPending}
                      className="w-full bg-fitness-primary text-white py-4 text-lg font-semibold hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
                    >
                      {calculateBMIMutation.isPending ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Calculating...
                        </>
                      ) : (
                        'Calculate BMI & Get Recommendations'
                      )}
                    </Button>
                  </form>
                </div>

                {/* Results Display */}
                <div className="lg:pl-8">
                  <h3 className="text-xl font-semibold mb-6 flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2" />
                    Your Results
                  </h3>
                  
                  {result ? (
                    <div className="space-y-6">
                      {/* BMI Display */}
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-none">
                        <CardContent className="p-6">
                          <div className="text-center">
                            <div className={`text-4xl font-bold mb-2 ${getBMIColor(result.bmi)}`}>
                              {result.bmi}
                            </div>
                            <div className="text-lg font-semibold text-green-600 mb-2">
                              {result.category}
                            </div>
                            <div className="text-sm text-gray-600">Healthy BMI range: 18.5 - 24.9</div>
                          </div>
                          
                          {/* BMI Scale Visual */}
                          <div className="mt-4">
                            <div className="w-full h-3 bg-gradient-to-r from-blue-400 via-green-400 via-yellow-400 to-red-400 rounded-full relative">
                              <div 
                                className="absolute w-3 h-3 bg-white border-2 border-gray-800 rounded-full transform -translate-y-0 -translate-x-1"
                                style={{ left: getBMIPosition(result.bmi) }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-600 mt-1">
                              <span>Underweight</span>
                              <span>Normal</span>
                              <span>Overweight</span>
                              <span>Obese</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Calorie Recommendations */}
                      <div className="space-y-4">
                        <Card className="bg-red-50 border-red-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-red-800">Weight Loss</h4>
                                <p className="text-sm text-red-600">Lose 0.5-1 kg/week</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-red-700">
                                  {result.recommendations.weightLoss.toLocaleString()}
                                </div>
                                <div className="text-sm text-red-600">calories/day</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-green-50 border-green-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-green-800">Maintain Weight</h4>
                                <p className="text-sm text-green-600">Current weight maintenance</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-green-700">
                                  {result.recommendations.maintenance.toLocaleString()}
                                </div>
                                <div className="text-sm text-green-600">calories/day</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="bg-blue-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h4 className="font-semibold text-blue-800">Weight Gain</h4>
                                <p className="text-sm text-blue-600">Gain 0.25-0.5 kg/week</p>
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-blue-700">
                                  {result.recommendations.weightGain.toLocaleString()}
                                </div>
                                <div className="text-sm text-blue-600">calories/day</div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      {/* Health Tips */}
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-4">
                          <h4 className="font-semibold text-amber-800 mb-2">💡 Health Tips</h4>
                          <ul className="text-sm text-amber-700 space-y-1">
                            <li>• Aim for 150 minutes of moderate exercise weekly</li>
                            <li>• Include strength training 2-3 times per week</li>
                            <li>• Stay hydrated with 8-10 glasses of water daily</li>
                            <li>• Focus on whole foods and balanced nutrition</li>
                          </ul>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter your details to calculate your BMI and get personalized recommendations</p>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
