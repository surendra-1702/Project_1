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

interface WorkoutTrackerSession {
  id: number;
  userId: number;
  date: string;
  exerciseName: string;
  sets: number;
  repsPerSet: number;
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
    exerciseName: '',
    sets: '',
    repsPerSet: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
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
      return await apiRequest('/api/workout-tracker-sessions', {
        method: 'POST',
        body: JSON.stringify(sessionData),
      });
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
      return await apiRequest(`/api/workout-tracker-sessions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(sessionData),
      });
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
        method: 'DELETE',
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
      exerciseName: '',
      sets: '',
      repsPerSet: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
    setEditingSession(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const sessionData = {
      ...formData,
      sets: parseInt(formData.sets),
      repsPerSet: parseInt(formData.repsPerSet),
    };

    if (editingSession) {
      updateSessionMutation.mutate({ id: editingSession.id, ...sessionData });
    } else {
      createSessionMutation.mutate(sessionData);
    }
  };

  const handleEdit = (session: WorkoutTrackerSession) => {
    setEditingSession(session);
    setFormData({
      exerciseName: session.exerciseName,
      sets: session.sets.toString(),
      repsPerSet: session.repsPerSet.toString(),
      notes: session.notes || '',
      date: new Date(session.date).toISOString().split('T')[0]
    });
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
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="exerciseName">Exercise Name</Label>
                  <Input
                    id="exerciseName"
                    value={formData.exerciseName}
                    onChange={(e) => setFormData({ ...formData, exerciseName: e.target.value })}
                    placeholder="e.g., Push-ups, Bench Press"
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
                  <Label htmlFor="sets">Number of Sets</Label>
                  <Input
                    id="sets"
                    type="number"
                    min="1"
                    value={formData.sets}
                    onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                    placeholder="3"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="repsPerSet">Reps per Set</Label>
                  <Input
                    id="repsPerSet"
                    type="number"
                    min="1"
                    value={formData.repsPerSet}
                    onChange={(e) => setFormData({ ...formData, repsPerSet: e.target.value })}
                    placeholder="12"
                    required
                  />
                </div>
              </div>

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
                          {session.exerciseName}
                        </h3>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(session.date), 'MMM d, yyyy')}
                        </Badge>
                      </div>
                      
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