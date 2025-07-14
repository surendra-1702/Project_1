import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { Activity, Dumbbell, Calendar, Trash2, Edit, Target, Timer, Flame } from 'lucide-react';
import { format } from 'date-fns';

interface Exercise {
  name: string;
  sets: number;
  reps: number;
  weight?: number;
}

interface WorkoutTrackerSession {
  id: number;
  userId: number;
  date: string;
  workoutName: string;
  exercises: Exercise[];
  totalDuration?: number;
  notes?: string;
  createdAt: string;
}

interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
}

export default function WorkoutTracker() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSession, setEditingSession] = useState<WorkoutTrackerSession | null>(null);
  const [formData, setFormData] = useState({
    workoutName: '',
    totalDuration: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [currentExercise, setCurrentExercise] = useState({
    name: '',
    sets: '',
    reps: '',
    weight: ''
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['/api/workout-tracker-sessions'],
    enabled: !!user,
  });

  const { data: stats } = useQuery<WorkoutStats>({
    queryKey: ['/api/workout-tracker-stats'],
    enabled: !!user,
  });

  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: any) => {
      const response = await apiRequest('/api/workout-tracker-sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workout-tracker-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workout-tracker-stats'] });
      toast({
        title: "Success!",
        description: "Workout session logged successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to log workout session",
        variant: "destructive",
      });
    }
  });

  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, ...sessionData }: any) => {
      const response = await apiRequest(`/api/workout-tracker-sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sessionData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workout-tracker-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workout-tracker-stats'] });
      toast({
        title: "Success!",
        description: "Workout session updated successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update workout session",
        variant: "destructive",
      });
    }
  });

  const deleteSessionMutation = useMutation({
    mutationFn: async (sessionId: number) => {
      return await apiRequest(`/api/workout-tracker-sessions/${sessionId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/workout-tracker-sessions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/workout-tracker-stats'] });
      toast({
        title: "Success!",
        description: "Workout session deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete workout session",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      workoutName: '',
      totalDuration: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setExercises([]);
    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: ''
    });
    setIsFormOpen(false);
    setEditingSession(null);
  };

  const addExercise = () => {
    if (!currentExercise.name || !currentExercise.sets || !currentExercise.reps) {
      toast({
        title: "Missing Information",
        description: "Please fill in exercise name, sets, and reps",
        variant: "destructive",
      });
      return;
    }

    const newExercise: Exercise = {
      name: currentExercise.name,
      sets: parseInt(currentExercise.sets),
      reps: parseInt(currentExercise.reps),
      weight: currentExercise.weight ? parseFloat(currentExercise.weight) : undefined
    };

    setExercises([...exercises, newExercise]);
    setCurrentExercise({
      name: '',
      sets: '',
      reps: '',
      weight: ''
    });
  };

  const removeExercise = (index: number) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (exercises.length === 0) {
      toast({
        title: "No Exercises",
        description: "Please add at least one exercise to your workout",
        variant: "destructive",
      });
      return;
    }

    const sessionData = {
      ...formData,
      exercises,
      totalDuration: formData.totalDuration ? parseInt(formData.totalDuration) : undefined,
    };

    if (editingSession) {
      updateSessionMutation.mutate({ 
        id: editingSession.id, 
        ...sessionData 
      });
    } else {
      createSessionMutation.mutate(sessionData);
    }
  };

  const handleEdit = (session: WorkoutTrackerSession) => {
    setEditingSession(session);
    setFormData({
      workoutName: session.workoutName,
      totalDuration: session.totalDuration?.toString() || '',
      notes: session.notes || '',
      date: new Date(session.date).toISOString().split('T')[0]
    });
    setExercises(session.exercises);
    setIsFormOpen(true);
  };

  const handleDelete = (sessionId: number) => {
    if (confirm('Are you sure you want to delete this workout session?')) {
      deleteSessionMutation.mutate(sessionId);
    }
  };

  if (sessionsLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Workout Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Log your workouts and track your fitness progress</p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Dumbbell className="h-4 w-4" />
          Log Workout
        </Button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <Activity className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Workouts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalWorkouts}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg mr-4">
                <Target className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Sets</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalSets}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mr-4">
                <Dumbbell className="h-6 w-6 text-purple-600 dark:text-purple-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reps</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalReps}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Workout Form */}
      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingSession ? 'Edit Workout Session' : 'Log New Workout Session'}</CardTitle>
            <CardDescription>
              Record your exercise details, sets, reps, and calories burned
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Workout Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="workoutName">Workout Name</Label>
                  <Input
                    id="workoutName"
                    value={formData.workoutName}
                    onChange={(e) => setFormData({ ...formData, workoutName: e.target.value })}
                    placeholder="e.g., Chest & Triceps, Full Body"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date">Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totalDuration">Total Duration (minutes)</Label>
                  <Input
                    id="totalDuration"
                    type="number"
                    min="1"
                    value={formData.totalDuration}
                    onChange={(e) => setFormData({ ...formData, totalDuration: e.target.value })}
                    placeholder="45"
                  />
                </div>
              </div>

              {/* Add Exercise Section */}
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="text-lg font-semibold">Add Exercise</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="exerciseName">Exercise Name</Label>
                    <Input
                      id="exerciseName"
                      value={currentExercise.name}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, name: e.target.value })}
                      placeholder="e.g., Push-ups"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sets">Sets</Label>
                    <Input
                      id="sets"
                      type="number"
                      min="1"
                      value={currentExercise.sets}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, sets: e.target.value })}
                      placeholder="3"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reps">Reps</Label>
                    <Input
                      id="reps"
                      type="number"
                      min="1"
                      value={currentExercise.reps}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, reps: e.target.value })}
                      placeholder="12"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="weight">Weight (optional)</Label>
                    <Input
                      id="weight"
                      type="number"
                      min="0"
                      step="0.5"
                      value={currentExercise.weight}
                      onChange={(e) => setCurrentExercise({ ...currentExercise, weight: e.target.value })}
                      placeholder="50kg"
                    />
                  </div>
                </div>

                <Button type="button" onClick={addExercise} className="w-full">
                  Add Exercise
                </Button>
              </div>

              {/* Exercise List */}
              {exercises.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Exercises ({exercises.length})</h3>
                  <div className="space-y-3">
                    {exercises.map((exercise, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex-1">
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {exercise.sets} sets × {exercise.reps} reps
                            {exercise.weight && ` @ ${exercise.weight}kg`}
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeExercise(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes about your workout..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createSessionMutation.isPending || updateSessionMutation.isPending}
                >
                  {editingSession ? 'Update Session' : 'Log Workout'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Workout Sessions List */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Workout Sessions</CardTitle>
          <CardDescription>Your logged workout history</CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <div className="text-center py-8">
              <Dumbbell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No workouts logged yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start tracking your fitness journey!</p>
              <Button onClick={() => setIsFormOpen(true)}>
                Log Your First Workout
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {sessions.map((session: WorkoutTrackerSession) => (
                <div
                  key={session.id}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {session.workoutName || session.exerciseName || 'Workout Session'}
                        </h3>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(session.date), 'MMM d, yyyy')}
                        </Badge>
                        {session.totalDuration && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {session.totalDuration}m
                          </Badge>
                        )}
                      </div>
                      
                      {/* Show exercises list for new format or single exercise for old format */}
                      {session.exercises && Array.isArray(session.exercises) ? (
                        <div className="space-y-2 mb-3">
                          {session.exercises.map((exercise, index) => (
                            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded">
                              <span className="font-medium">{exercise.name}</span>
                              <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                                <span>{exercise.sets} × {exercise.reps}</span>
                                {exercise.weight && <span>{exercise.weight}kg</span>}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        // Legacy format support
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                          <div className="flex items-center gap-2">
                            <Target className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              {session.sets} sets × {session.repsPerSet} reps
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Dumbbell className="h-4 w-4 text-purple-500" />
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              Total: {session.sets * session.repsPerSet} reps
                            </span>
                          </div>
                        </div>
                      )}
                      
                      {session.notes && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                          {session.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(session)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}