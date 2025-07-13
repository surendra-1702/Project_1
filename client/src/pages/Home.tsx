import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, Play, Dumbbell, Bot, TrendingUp, Users } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative hero-gradient text-white overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 bg-black/40"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-red-900/20"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left animate-fade-in">
              <h1 className="text-6xl lg:text-8xl font-black leading-tight mb-8 text-athletic tracking-tight">
                UNLEASH YOUR <span className="text-energy bg-gradient-to-r from-red-500 to-red-600 bg-clip-text text-transparent">POWER</span>
              </h1>
              <p className="text-2xl text-gray-300 mb-12 leading-relaxed font-medium">
                Push your limits with AI-powered workouts, real-time tracking, and the ultimate fitness experience designed for champions.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link href="/planner">
                  <Button
                    size="lg"
                    className="btn-primary text-xl px-8 py-4 hover-glow hover-lift font-black uppercase tracking-wider"
                  >
                    START CRUSHING IT
                    <ArrowRight className="ml-3 h-6 w-6" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-2 border-red-600 text-red-400 hover:bg-red-600 hover:text-white text-xl px-8 py-4 font-bold uppercase tracking-wide transition-all duration-300 hover-lift"
                >
                  <Play className="mr-3 h-6 w-6" />
                  WATCH THE BEAST
                </Button>
              </div>
            </div>
            
            <div className="relative animate-slide-up">
              <div className="glass-card-dark rounded-3xl p-8 border border-red-600/30 hover-lift">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-2xl font-black text-white text-athletic uppercase tracking-wide">BEAST MODE</h3>
                  <span className="text-red-400 text-lg font-bold bg-red-600/20 px-3 py-1 rounded-lg">
                    <TrendingUp className="inline h-5 w-5 mr-2" />
                    +25% POWER
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-red-600/20 rounded-2xl p-6 border border-red-600/30 hover-glow">
                    <div className="text-4xl font-black text-red-400 mb-2">2,847</div>
                    <div className="text-sm text-gray-300 font-bold uppercase tracking-wide">CALORIES CRUSHED</div>
                  </div>
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600/30">
                    <div className="text-4xl font-black text-white mb-2">85min</div>
                    <div className="text-sm text-gray-300 font-bold uppercase tracking-wide">ACTIVE DOMINATION</div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-lg mb-4 font-bold">
                    <span className="text-white">WEEKLY CONQUEST</span>
                    <span className="text-red-400">87%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-4">
                    <div className="bg-gradient-to-r from-red-600 to-red-400 h-4 rounded-full w-5/6 shadow-lg"></div>
                  </div>
                </div>
                
                <div className="text-center">
                  <button className="btn-primary px-6 py-3 font-black uppercase tracking-wide hover-glow">
                    PUSH HARDER
                  </button>
                </div>
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
      <section className="py-24 bg-gray-900 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-6xl font-black text-white mb-6 text-athletic uppercase tracking-tight">
              CHOOSE YOUR <span className="text-energy">WEAPON</span>
            </h2>
            <p className="text-2xl text-gray-300 font-medium">Select your path to absolute domination</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link href="/exercises">
              <div className="glass-card-dark rounded-2xl p-8 text-center hover-lift hover-glow border border-red-600/20 group transition-all duration-300">
                <div className="bg-red-600/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110">
                  <Dumbbell className="h-10 w-10 text-red-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white text-athletic uppercase tracking-wide">EXERCISE ARSENAL</h3>
                <p className="text-gray-300 font-medium">Master thousands of exercises with explosive demonstrations</p>
              </div>
            </Link>

            <Link href="/bmi">
              <div className="glass-card-dark rounded-2xl p-8 text-center hover-lift hover-glow border border-red-600/20 group transition-all duration-300">
                <div className="bg-red-600/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-10 w-10 text-red-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white text-athletic uppercase tracking-wide">BMI DOMINATOR</h3>
                <p className="text-gray-300 font-medium">Calculate your body metrics and unlock your potential</p>
              </div>
            </Link>

            <Link href="/planner">
              <div className="glass-card-dark rounded-2xl p-8 text-center hover-lift hover-glow border border-red-600/20 group transition-all duration-300">
                <div className="bg-red-600/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110">
                  <Bot className="h-10 w-10 text-red-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white text-athletic uppercase tracking-wide">AI BEAST PLANNER</h3>
                <p className="text-gray-300 font-medium">Get AI-generated workout plans tailored to crush your goals</p>
              </div>
            </Link>

            <Link href="/calories">
              <div className="glass-card-dark rounded-2xl p-8 text-center hover-lift hover-glow border border-red-600/20 group transition-all duration-300">
                <div className="bg-red-600/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110">
                  <TrendingUp className="h-10 w-10 text-red-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white text-athletic uppercase tracking-wide">CALORIE CRUSHER</h3>
                <p className="text-gray-300 font-medium">Track your daily nutrition and fuel your machine</p>
              </div>
            </Link>

            <Link href="/workout-tracker">
              <div className="glass-card-dark rounded-2xl p-8 text-center hover-lift hover-glow border border-red-600/20 group transition-all duration-300">
                <div className="bg-red-600/20 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-red-600 transition-all duration-300 group-hover:scale-110">
                  <Users className="h-10 w-10 text-red-400 group-hover:text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-white text-athletic uppercase tracking-wide">WORKOUT TRACKER</h3>
                <p className="text-gray-300 font-medium">Track every rep, set, and victory on your journey</p>
              </div>
            </Link>

            <Link href="/planner">
              <div className="glass-card-dark rounded-2xl p-8 text-center hover-lift hover-glow border-2 border-red-600 group transition-all duration-300 bg-red-600/10">
                <div className="bg-red-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-all duration-300 shadow-lg hover-glow">
                  <ArrowRight className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-4 text-red-400 text-athletic uppercase tracking-wide">START CRUSHING</h3>
                <p className="text-gray-300 font-medium">Begin your journey to absolute fitness domination</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
