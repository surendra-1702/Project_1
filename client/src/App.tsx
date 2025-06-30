import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import Home from "@/pages/Home";
import Exercises from "@/pages/Exercises";
import BMICalculator from "@/pages/BMICalculator";
import WorkoutPlanner from "@/pages/WorkoutPlanner";
import CalorieCounter from "@/pages/CalorieCounter";
import Blogs from "@/pages/Blogs";
import Auth from "@/pages/Auth";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/exercises" component={Exercises} />
      <Route path="/bmi" component={BMICalculator} />
      <Route path="/planner" component={WorkoutPlanner} />
      <Route path="/calories" component={CalorieCounter} />
      <Route path="/blogs" component={Blogs} />
      <Route path="/auth" component={Auth} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
