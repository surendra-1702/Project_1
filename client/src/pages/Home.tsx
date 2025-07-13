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
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white hover:text-primary"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <Card className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Today's Progress</h3>
                  <span className="text-green-500 text-sm font-medium">
                    <TrendingUp className="inline h-4 w-4 mr-1" />
                    12% increase
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-600">1,247</div>
                    <div className="text-sm text-gray-600">Calories Burned</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-600">45min</div>
                    <div className="text-sm text-gray-600">Active Time</div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Weekly Goal</span>
                    <span>73%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full w-3/4"></div>
                  </div>
                </div>
              </Card>
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
                  <Users className="h-8 w-8 text-amber-400 mx-auto" />
                </div>
                <h3 className="font-semibold mb-2">Community</h3>
                <p className="text-sm text-blue-100">Share tips and motivation with others</p>
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

            <Link href="/blogs">
              <Card className="hover:shadow-xl transition-shadow cursor-pointer group">
                <CardContent className="p-8 text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-200 transition-colors">
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Community Blogs</h3>
                  <p className="text-gray-600">Share your journey and get inspired by others</p>
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
