import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Play } from 'lucide-react';

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

interface ExerciseCardProps {
  exercise: Exercise;
  onAddToWorkout?: (exercise: Exercise) => void;
  onViewDetails?: (exercise: Exercise) => void;
}

export default function ExerciseCard({ exercise, onAddToWorkout, onViewDetails }: ExerciseCardProps) {
  const getBodyPartColor = (bodyPart: string) => {
    const colors = {
      chest: 'bg-blue-100 text-blue-800',
      back: 'bg-green-100 text-green-800',
      shoulders: 'bg-purple-100 text-purple-800',
      arms: 'bg-red-100 text-red-800',
      abs: 'bg-yellow-100 text-yellow-800',
      legs: 'bg-indigo-100 text-indigo-800',
      cardio: 'bg-pink-100 text-pink-800',
    };
    return colors[bodyPart.toLowerCase() as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const getTargetColor = (target: string) => {
    return 'bg-green-100 text-green-800';
  };

  return (
    <Card className="overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
      {/* Exercise GIF/Image */}
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {exercise.gifUrl ? (
          <img
            src={exercise.gifUrl}
            alt={exercise.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center">
            <Play className="h-12 w-12 text-white opacity-80" />
          </div>
        )}
        
        {exercise.gifUrl && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
            GIF Demo
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <h3 className="font-semibold text-lg mb-2 line-clamp-2">
          {exercise.name}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <Badge className={getBodyPartColor(exercise.bodyPart)}>
            {exercise.bodyPart}
          </Badge>
          <Badge className={getTargetColor(exercise.target)}>
            {exercise.target}
          </Badge>
        </div>
        
        {exercise.instructions && exercise.instructions.length > 0 && (
          <p className="text-gray-600 text-sm mb-4 line-clamp-3">
            {exercise.instructions[0]}
          </p>
        )}
        
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            onClick={() => onViewDetails?.(exercise)}
            className="text-primary hover:text-primary/80"
          >
            View Details
          </Button>
          
          <Button
            size="sm"
            onClick={() => onAddToWorkout?.(exercise)}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add to Plan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
