import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, Dumbbell, Bot, TrendingUp, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Transform Your <span className="text-amber-400">Fitness Journey</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Get personalized workout plans, track your progress, and achieve your fitness goals 
                with AI-powered recommendations and expert guidance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/planner">
                  <Button
                    size="lg"
                    className="bg-amber-500 text-white hover:bg-amber-600 transition-all transform hover:scale-105 shadow-lg"
                  >
                    Get Fit Now
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>

              </div>
            </div>
            

          </div>
        </div>

        {/* Feature highlights */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
          <div className="grid md:grid-cols-4 gap-6 text-center">
            <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-none text-white">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">
                  <Dumbbell className="h-8 w-8 text-amber-400 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">1000+ Exercises</h3>
                <p className="text-sm text-blue-100">GIF demonstrations for all muscle groups</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-none text-white">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">
                  <Bot className="h-8 w-8 text-amber-400 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Plans</h3>
                <p className="text-sm text-blue-100">Personalized workouts based on your goals</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-none text-white">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">
                  <TrendingUp className="h-8 w-8 text-amber-400 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Progress Tracking</h3>
                <p className="text-sm text-blue-100">Monitor your fitness journey in real-time</p>
              </CardContent>
            </Card>
            
            <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-none text-white">
              <CardContent className="p-6">
                <div className="text-3xl mb-3">
                  <TrendingUp className="h-8 w-8 text-amber-400 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Calorie Counter</h3>
                <p className="text-sm text-blue-100">Track your daily nutrition and calorie intake</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Start Your Fitness Journey</h2>
            <p className="text-xl text-gray-600">Choose your path to a healthier you</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/exercises">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
                    <Dumbbell className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Exercise Library</h3>
                  <p className="text-gray-600">Browse thousands of exercises with video demonstrations</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/bmi">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">BMI Calculator</h3>
                  <p className="text-gray-600">Calculate your BMI and get personalized recommendations</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/planner">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
                    <Bot className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">AI Workout Planner</h3>
                  <p className="text-gray-600">Get AI-generated workout plans tailored to your goals</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/calories">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-yellow-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Calorie Counter</h3>
                  <p className="text-gray-600">Track your daily nutrition and calorie intake</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/workout-tracker">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
                    <Dumbbell className="h-8 w-8 text-orange-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Workout Tracker</h3>
                  <p className="text-gray-600">Log your workouts and track your fitness progress</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/weight-tracker">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-200 transition-colors">
                    <TrendingUp className="h-8 w-8 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Weight Tracker</h3>
                  <p className="text-gray-600">Monitor your weight changes and goal progress</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/auth">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group border-2 border-primary">
                <CardContent className="p-8 text-center">
                  <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/90 transition-colors">
                    <ArrowRight className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-primary">Get Started</h3>
                  <p className="text-gray-600">Create your account and start your fitness journey today</p>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
