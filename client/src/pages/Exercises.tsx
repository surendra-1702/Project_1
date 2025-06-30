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
  { name: 'chest', icon: '💪', gradient: 'bodypart-chest' },
  { name: 'back', icon: '🛡️', gradient: 'bodypart-back' },
  { name: 'shoulders', icon: '👤', gradient: 'bodypart-shoulders' },
  { name: 'upper arms', icon: '💪', gradient: 'bodypart-arms' },
  { name: 'waist', icon: '⬜', gradient: 'bodypart-abs' },
  { name: 'upper legs', icon: '🏃', gradient: 'bodypart-legs' },
];

interface Exercise {
  id: number;
  exerciseId: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string | null;
  instructions: string[] | null;
}

interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channel: string;
  duration: string;
}

export default function Exercises() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBodyPart, setSelectedBodyPart] = useState('');
  const { toast } = useToast();

  // Fetch exercises
  const { data: exercises = [], isLoading: exercisesLoading } = useQuery({
    queryKey: ['/api/exercises', { bodyPart: selectedBodyPart, search: searchQuery }],
    queryFn: async () => {
      let url = '/api/exercises';
      if (selectedBodyPart) {
        url = `/api/exercises/bodypart/${selectedBodyPart}`;
      } else if (searchQuery) {
        url = `/api/exercises/search?q=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch exercises');
      return response.json();
    },
  });

  // Fetch YouTube videos based on search
  const { data: youtubeVideos = [] } = useQuery({
    queryKey: ['/api/youtube/search', { query: searchQuery || selectedBodyPart }],
    queryFn: async () => {
      if (!searchQuery && !selectedBodyPart) return [];
      
      const query = searchQuery || selectedBodyPart;
      const response = await fetch(`/api/youtube/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) return [];
      return response.json();
    },
    enabled: !!(searchQuery || selectedBodyPart),
  });

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search Required",
        description: "Please enter an exercise name to search",
        variant: "destructive",
      });
      return;
    }
    setSelectedBodyPart('');
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
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
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
              Browse by Body Part
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {bodyParts.map((part) => (
                <Button
                  key={part.name}
                  onClick={() => handleBodyPartFilter(part.name)}
                  className={`${part.gradient} text-white p-6 h-auto flex-col hover:scale-105 transition-transform shadow-lg`}
                  variant={selectedBodyPart === part.name ? "default" : "secondary"}
                >
                  <div className="text-3xl mb-2">{part.icon}</div>
                  <div className="font-semibold capitalize">
                    {part.name.replace('upper ', '')}
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
                  'No exercises found matching your criteria' : 
                  'Search for exercises or select a body part to get started'
                }
              </div>
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

          {/* YouTube Video Recommendations */}
          {youtubeVideos.length > 0 && (
            <div className="mt-12">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Related YouTube Videos</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {youtubeVideos.slice(0, 6).map((video: YouTubeVideo) => (
                  <Card key={video.id} className="overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gradient-to-br from-red-500 to-pink-600 relative">
                      {video.thumbnail ? (
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-6xl text-white opacity-90">▶</div>
                        </div>
                      )}
                      {video.duration && (
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-xs">
                          {video.duration}
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{video.title}</h4>
                      <p className="text-gray-600 text-xs">{video.channel}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
