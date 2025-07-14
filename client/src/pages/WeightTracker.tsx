import React, { useState, useMemo } from 'react';
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
import { Weight, TrendingUp, TrendingDown, Target, Calendar, Plus, Trash2, Edit } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface WeightEntry {
  id: number;
  userId: number;
  weight: number;
  date: string;
  goalWeight?: number;
  notes?: string;
  createdAt: string;
}

export default function WeightTracker() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<WeightEntry | null>(null);
  const [formData, setFormData] = useState({
    weight: '',
    goalWeight: '',
    notes: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: entries = [], isLoading: entriesLoading } = useQuery({
    queryKey: ['/api/weight-entries'],
    enabled: !!user,
  });

  const { data: latestEntry } = useQuery<WeightEntry | null>({
    queryKey: ['/api/weight-entries/latest'],
    enabled: !!user,
  });

  const createEntryMutation = useMutation({
    mutationFn: async (entryData: any) => {
      const response = await apiRequest('/api/weight-entries', {
        method: 'POST',
        body: JSON.stringify(entryData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries/latest'] });
      toast({
        title: "Success!",
        description: "Weight entry recorded successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to record weight entry",
        variant: "destructive",
      });
    }
  });

  const updateEntryMutation = useMutation({
    mutationFn: async ({ id, ...entryData }: any) => {
      const response = await apiRequest(`/api/weight-entries/${id}`, {
        method: 'PUT',
        body: JSON.stringify(entryData)
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries/latest'] });
      toast({
        title: "Success!",
        description: "Weight entry updated successfully",
      });
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update weight entry",
        variant: "destructive",
      });
    }
  });

  const deleteEntryMutation = useMutation({
    mutationFn: async (entryId: number) => {
      return await apiRequest(`/api/weight-entries/${entryId}`, {
        method: 'DELETE'
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries'] });
      queryClient.invalidateQueries({ queryKey: ['/api/weight-entries/latest'] });
      toast({
        title: "Success!",
        description: "Weight entry deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete weight entry",
        variant: "destructive",
      });
    }
  });

  const resetForm = () => {
    setFormData({
      weight: '',
      goalWeight: '',
      notes: '',
      date: new Date().toISOString().split('T')[0]
    });
    setIsFormOpen(false);
    setEditingEntry(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const entryData = {
      ...formData,
      weight: parseFloat(formData.weight),
      goalWeight: formData.goalWeight ? parseFloat(formData.goalWeight) : undefined,
    };

    if (editingEntry) {
      updateEntryMutation.mutate({ id: editingEntry.id, ...entryData });
    } else {
      createEntryMutation.mutate(entryData);
    }
  };

  const handleEdit = (entry: WeightEntry) => {
    setEditingEntry(entry);
    setFormData({
      weight: entry.weight.toString(),
      goalWeight: entry.goalWeight?.toString() || '',
      notes: entry.notes || '',
      date: new Date(entry.date).toISOString().split('T')[0]
    });
    setIsFormOpen(true);
  };

  const handleDelete = (entryId: number) => {
    if (confirm('Are you sure you want to delete this weight entry?')) {
      deleteEntryMutation.mutate(entryId);
    }
  };

  // Calculate progress metrics
  const progressMetrics = useMemo(() => {
    if (entries.length < 2) return null;

    const sortedEntries = [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const firstEntry = sortedEntries[0];
    const lastEntry = sortedEntries[sortedEntries.length - 1];
    
    const totalChange = lastEntry.weight - firstEntry.weight;
    const daysBetween = differenceInDays(new Date(lastEntry.date), new Date(firstEntry.date));
    const averageChangePerWeek = daysBetween > 0 ? (totalChange / daysBetween) * 7 : 0;

    const goalWeight = lastEntry.goalWeight || firstEntry.goalWeight;
    const remainingToGoal = goalWeight ? goalWeight - lastEntry.weight : null;

    return {
      totalChange,
      averageChangePerWeek,
      remainingToGoal,
      goalWeight,
      currentWeight: lastEntry.weight,
      daysTracking: daysBetween
    };
  }, [entries]);

  // Prepare chart data
  const chartData = useMemo(() => {
    return entries
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(entry => ({
        date: format(new Date(entry.date), 'MMM d'),
        weight: entry.weight,
        goalWeight: entry.goalWeight
      }));
  }, [entries]);

  if (entriesLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Weight Tracker</h1>
          <p className="text-gray-600 dark:text-gray-400">Track your weight progress and achieve your goals</p>
        </div>
        <Button 
          onClick={() => {
            resetForm();
            setIsFormOpen(true);
          }}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Weight Entry
        </Button>
      </div>

      {/* Progress Overview */}
      {progressMetrics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg mr-4">
                <Weight className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Current Weight</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{progressMetrics.currentWeight} kg</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center p-6">
              <div className={`flex items-center justify-center w-12 h-12 rounded-lg mr-4 ${
                progressMetrics.totalChange >= 0 
                  ? 'bg-green-100 dark:bg-green-900' 
                  : 'bg-red-100 dark:bg-red-900'
              }`}>
                {progressMetrics.totalChange >= 0 ? (
                  <TrendingUp className="h-6 w-6 text-green-600 dark:text-green-300" />
                ) : (
                  <TrendingDown className="h-6 w-6 text-red-600 dark:text-red-300" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Change</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {progressMetrics.totalChange > 0 ? '+' : ''}{progressMetrics.totalChange.toFixed(1)} kg
                </p>
              </div>
            </CardContent>
          </Card>

          {progressMetrics.goalWeight && (
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Goal Weight</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{progressMetrics.goalWeight} kg</p>
                </div>
              </CardContent>
            </Card>
          )}

          {progressMetrics.remainingToGoal !== null && (
            <Card>
              <CardContent className="flex items-center p-6">
                <div className="flex items-center justify-center w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-lg mr-4">
                  <Target className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">To Goal</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.abs(progressMetrics.remainingToGoal).toFixed(1)} kg
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Weight Chart */}
      {chartData.length > 1 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Weight Progress Chart</CardTitle>
            <CardDescription>Your weight journey over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={['dataMin - 2', 'dataMax + 2']} />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      `${value} kg`, 
                      name === 'weight' ? 'Weight' : 'Goal Weight'
                    ]}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#3b82f6" 
                    strokeWidth={3} 
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  />
                  {chartData.some(d => d.goalWeight) && (
                    <Line 
                      type="monotone" 
                      dataKey="goalWeight" 
                      stroke="#ef4444" 
                      strokeWidth={2} 
                      strokeDasharray="5 5"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 3 }}
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weight Entry Form */}
      {isFormOpen && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{editingEntry ? 'Edit Weight Entry' : 'Add New Weight Entry'}</CardTitle>
            <CardDescription>
              Record your current weight and track progress toward your goal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="weight">Current Weight (kg)</Label>
                  <Input
                    id="weight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                    placeholder="70.5"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="goalWeight">Goal Weight (kg)</Label>
                  <Input
                    id="goalWeight"
                    type="number"
                    step="0.1"
                    min="0"
                    value={formData.goalWeight}
                    onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                    placeholder="65.0"
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="How are you feeling? Any observations about your progress..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  disabled={createEntryMutation.isPending || updateEntryMutation.isPending}
                >
                  {editingEntry ? 'Update Entry' : 'Add Entry'}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Weight Entries List */}
      <Card>
        <CardHeader>
          <CardTitle>Weight History</CardTitle>
          <CardDescription>Your recorded weight entries</CardDescription>
        </CardHeader>
        <CardContent>
          {entries.length === 0 ? (
            <div className="text-center py-8">
              <Weight className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No weight entries yet</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">Start tracking your weight progress!</p>
              <Button onClick={() => setIsFormOpen(true)}>
                Add Your First Entry
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {entries
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((entry: WeightEntry) => (
                  <div
                    key={entry.id}
                    className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {entry.weight} kg
                          </h3>
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(entry.date), 'MMM d, yyyy')}
                          </Badge>
                          {entry.goalWeight && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              Goal: {entry.goalWeight} kg
                            </Badge>
                          )}
                        </div>
                        
                        {entry.notes && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {entry.notes}
                          </p>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(entry)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(entry.id)}
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