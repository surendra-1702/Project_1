import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Loader2 } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import ExerciseCard from '@/components/ExerciseCard';
import { useToast } from '@/hooks/use-toast';

const bodyParts = [
  { name: 'chest', icon: '💪', gradient: 'bg-gradient-to-br from-red-500 to-red-700' },
  { name: 'back', icon: '🛡️', gradient: 'bg-gradient-to-br from-blue-500 to-blue-700' },
  { name: 'shoulders', icon: '👤', gradient: 'bg-gradient-to-br from-yellow-500 to-yellow-700' },
  { name: 'traps', icon: '🔺', gradient: 'bg-gradient-to-br from-orange-500 to-orange-700' },
  { name: 'legs', icon: '🏃', gradient: 'bg-gradient-to-br from-green-500 to-green-700' },
  { name: 'abs', icon: '⬜', gradient: 'bg-gradient-to-br from-teal-500 to-teal-700' },
  { name: 'biceps', icon: '💪', gradient: 'bg-gradient-to-br from-pink-500 to-pink-700' },
  { name: 'triceps', icon: '🔻', gradient: 'bg-gradient-to-br from-rose-500 to-rose-700' },
  { name: 'arms', icon: '🦾', gradient: 'bg-gradient-to-br from-violet-500 to-violet-700' },
  { name: 'cardio', icon: '❤️', gradient: 'bg-gradient-to-br from-red-600 to-red-800' },
  { name: 'forearms', icon: '✊', gradient: 'bg-gradient-to-br from-gray-500 to-gray-700' },
];

interface Exercise {
  id: number;
  exerciseId: string;
  name: string;
  bodyPart?: string;
  target?: string;
  equipment?: string;
  gifUrl?: string | null;
  instructions?: string[] | null;
}

interface ExerciseGif {
  filename: string;
  name: string;
  url: string;
}



export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const { toast } = useToast();

  // Fetch exercise GIFs based on selected body part or search
  const { data: exerciseGifs = [], isLoading: exercisesLoading } = useQuery({
    queryKey: ['/api/exercise-gifs', { bodyPart: selectedBodyPart, search: searchQuery }],
    queryFn: async () => {
      let allGifs: ExerciseGif[] = [];
      
      if (selectedBodyPart) {
        // Fetch GIFs for specific body part
        const response = await fetch(`/api/exercise-gifs/${selectedBodyPart}`);
        if (response.ok) {
          const gifs = await response.json();
          allGifs = gifs.map((gif: ExerciseGif) => ({
            ...gif,
            bodyPart: selectedBodyPart
          }));
        }
      } else if (searchQuery) {
        // Search across all body parts
        const bodyPartNames = bodyParts.map(bp => bp.name);
        const promises = bodyPartNames.map(async (bodyPart) => {
          try {
            const response = await fetch(`/api/exercise-gifs/${bodyPart}`);
            if (response.ok) {
              const gifs = await response.json();
              return gifs
                .filter((gif: ExerciseGif) => 
                  gif.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  bodyPart.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((gif: ExerciseGif) => ({
                  ...gif,
                  bodyPart
                }));
            }
          } catch (error) {
            console.error(`Error fetching ${bodyPart} GIFs:`, error);
          }
          return [];
        });
        
        const results = await Promise.all(promises);
        allGifs = results.flat();
      }
      
      return allGifs;
    },
    enabled: !!(selectedBodyPart || searchQuery),
  });

  // Convert GIFs to Exercise objects for the ExerciseCard component
  const exercises: Exercise[] = exerciseGifs.map((gif, index) => ({
    id: index + 1,
    exerciseId: gif.filename.replace('.gif', ''),
    name: gif.name,
    bodyPart: (gif as any).bodyPart || '',
    target: (gif as any).bodyPart || '',
    equipment: 'bodyweight',
    gifUrl: gif.url,
    instructions: [`Perform ${gif.name} with proper form and controlled movements.`],
  }));

  const handleSearch = () => {
    setSelectedBodyPart('');
    // Search will automatically trigger via useQuery when searchQuery changes
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleBodyPartFilter = (bodyPart: string) => {
    setSelectedBodyPart(bodyPart);
    setSearchQuery('');
  };

  const handleAddToWorkout = (exercise: Exercise) => {
    toast({
      title: "Exercise Added",
      description: `${exercise.name} has been added to your workout plan`,
    });
  };

  const handleViewDetails = (exercise: Exercise) => {
    toast({
      title: "Exercise Details",
      description: `Viewing details for ${exercise.name}`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Exercise Library</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover thousands of exercises with step-by-step GIF demonstrations and detailed instructions
            </p>
          </div>

          {/* Search */}
          <div className="mb-12">
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search exercises (e.g., push-ups, squats, deadlifts...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyPress}
                  className="pr-12 text-lg py-6 border-2 focus:border-primary"
                />
                <Button
                  onClick={handleSearch}
                  variant="ghost"
                  size="icon"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>

          {/* Body Parts Filter */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Browse by Muscle Group
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
              {bodyParts.map((part) => (
                <Button
                  key={part.name}
                  onClick={() => handleBodyPartFilter(part.name)}
                  className={`${part.gradient} text-white p-4 h-auto flex-col hover:scale-105 transition-transform shadow-lg ${selectedBodyPart === part.name ? 'ring-4 ring-white ring-opacity-50' : ''}`}
                >
                  <div className="text-2xl mb-2">{part.icon}</div>
                  <div className="font-semibold text-xs text-center">
                    {part.name.replace('-', ' ')}
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {(selectedBodyPart || searchQuery) && (
            <div className="mb-6 flex items-center gap-4 justify-center">
              <div className="flex items-center gap-2">
                {selectedBodyPart && (
                  <Badge variant="secondary" className="text-sm">
                    Body Part: {selectedBodyPart}
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="text-sm">
                    Search: {searchQuery}
                  </Badge>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedBodyPart('');
                  setSearchQuery('');
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}

          {/* Exercise Results */}
          {exercisesLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading exercises...</span>
            </div>
          ) : exercises.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500 mb-4">
                {searchQuery || selectedBodyPart ? 
                  'No exercise GIFs found matching your criteria. Add GIF files to the exercise-gifs folders to see them here.' : 
                  'Search for exercises or select a muscle group to view available exercise GIFs'
                }
              </div>
              {!searchQuery && !selectedBodyPart && (
                <div className="bg-blue-50 p-6 rounded-lg max-w-2xl mx-auto">
                  <h3 className="font-semibold text-blue-900 mb-3">🏗️ How to Add Exercise GIFs</h3>
                  <div className="text-sm text-blue-800 space-y-2">
                    <p>• Upload GIF files to the muscle group folders in <code className="bg-blue-100 px-1 rounded">public/exercise-gifs/</code></p>
                    <p>• Use naming format: <code className="bg-blue-100 px-1 rounded">exercise-name-variation.gif</code></p>
                    <p>• Example: <code className="bg-blue-100 px-1 rounded">push-up-standard.gif</code> in the <code className="bg-blue-100 px-1 rounded">chest/</code> folder</p>
                    <p>• Currently showing placeholder demonstrations until real GIFs are added</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {exercises.map((exercise: Exercise) => (
                <ExerciseCard
                  key={exercise.id}
                  exercise={exercise}
                  onAddToWorkout={handleAddToWorkout}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {/* Exercise Stats */}
          {exercises.length > 0 && (
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6">
              <div className="text-center">
                <h3 className="text-2xl font-semibold text-gray-900 mb-4">Exercise Library Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-blue-600">{exercises.length}</div>
                    <div className="text-sm text-gray-600">Available Exercises</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-green-600">
                      {selectedBodyPart ? '1' : new Set(exercises.map(e => e.bodyPart)).size}
                    </div>
                    <div className="text-sm text-gray-600">Muscle Groups</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-purple-600">100%</div>
                    <div className="text-sm text-gray-600">Local Storage</div>
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl font-bold text-orange-600">GIF</div>
                    <div className="text-sm text-gray-600">Demonstrations</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
