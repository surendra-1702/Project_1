import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Dumbbell } from 'lucide-react';

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

interface ExerciseCardProps {
  exercise: Exercise;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const getBodyPartColor = (bodyPart: string | undefined | null) => {
    if (!bodyPart || typeof bodyPart !== 'string') return 'bg-gray-100 text-gray-800';
    
    const colors: Record<string, string> = {
      chest: 'bg-red-100 text-red-800',
      back: 'bg-blue-100 text-blue-800',
      'upper-back': 'bg-indigo-100 text-indigo-800',
      'lower-back': 'bg-purple-100 text-purple-800',
      shoulders: 'bg-yellow-100 text-yellow-800',
      traps: 'bg-orange-100 text-orange-800',
      legs: 'bg-green-100 text-green-800',
      abs: 'bg-teal-100 text-teal-800',
      biceps: 'bg-pink-100 text-pink-800',
      triceps: 'bg-rose-100 text-rose-800',
      arms: 'bg-violet-100 text-violet-800',
      cardio: 'bg-red-100 text-red-800',
      forearms: 'bg-gray-100 text-gray-800',
      calves: 'bg-emerald-100 text-emerald-800',
    };
    return colors[bodyPart.toLowerCase()] || 'bg-gray-100 text-gray-800';
  };

  const getExerciseVisualization = () => {
    const bodyPart = (exercise.bodyPart && typeof exercise.bodyPart === 'string') ? exercise.bodyPart.toLowerCase() : '';
    const name = (exercise.name && typeof exercise.name === 'string') ? exercise.name.toLowerCase() : '';

    if (name.includes('pull-up') || name.includes('pull up')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
              <circle cx="60" cy="30" r="12" fill="#3b82f6" />
              <rect x="55" y="42" width="10" height="40" fill="#3b82f6" />
              <rect x="45" y="50" width="30" height="6" fill="#3b82f6" />
              <rect x="50" y="82" width="8" height="25" fill="#3b82f6" />
              <rect x="62" y="82" width="8" height="25" fill="#3b82f6" />
              <rect x="35" y="20" width="50" height="4" fill="#6b7280" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Activity className="h-8 w-8 text-blue-600 animate-bounce" />
            </div>
          </div>
        </div>
      );
    }

    if (name.includes('bicep') || name.includes('curl')) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
          <div className="relative">
            <svg width="120" height="120" viewBox="0 0 120 120" className="animate-pulse">
              <circle cx="60" cy="25" r="10" fill="#ef4444" />
              <rect x="57" y="35" width="6" height="35" fill="#ef4444" />
              <circle cx="45" cy="55" r="8" fill="#f97316" />
              <rect x="42" y="47" width="6" height="16" fill="#f97316" className="animate-bounce" />
              <rect x="55" y="70" width="5" height="20" fill="#ef4444" />
              <rect x="62" y="70" width="5" height="20" fill="#ef4444" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Dumbbell className="h-6 w-6 text-red-600 animate-pulse" />
            </div>
          </div>
        </div>
      );
    }

    const getBodyPartVisualization = () => {
      switch (bodyPart) {
        case 'chest':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="20" r="8" fill="#3b82f6" />
                <rect x="47" y="28" width="6" height="30" fill="#3b82f6" />
                <rect x="35" y="35" width="30" height="15" fill="#3b82f6" />
                <rect x="45" y="58" width="5" height="20" fill="#3b82f6" />
                <rect x="52" y="58" width="5" height="20" fill="#3b82f6" />
              </svg>
            </div>
          );
        case 'back':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="20" r="8" fill="#10b981" />
                <rect x="47" y="28" width="6" height="30" fill="#10b981" />
                <rect x="30" y="35" width="40" height="20" fill="#10b981" />
                <rect x="45" y="58" width="5" height="20" fill="#10b981" />
                <rect x="52" y="58" width="5" height="20" fill="#10b981" />
              </svg>
            </div>
          );
        case 'arms':
        case 'biceps':
        case 'triceps':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="20" r="8" fill="#ef4444" />
                <rect x="47" y="28" width="6" height="25" fill="#ef4444" />
                <circle cx="35" cy="40" r="6" fill="#f97316" />
                <circle cx="65" cy="40" r="6" fill="#f97316" />
                <rect x="32" y="34" width="6" height="20" fill="#f97316" className="animate-bounce" />
                <rect x="62" y="34" width="6" height="20" fill="#f97316" className="animate-bounce" />
              </svg>
            </div>
          );
        case 'legs':
        case 'calves':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-indigo-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="15" r="8" fill="#6366f1" />
                <rect x="47" y="23" width="6" height="25" fill="#6366f1" />
                <rect x="35" y="35" width="30" height="10" fill="#6366f1" />
                <rect x="45" y="48" width="5" height="30" fill="#6366f1" className="animate-bounce" />
                <rect x="52" y="48" width="5" height="30" fill="#6366f1" className="animate-bounce" />
              </svg>
            </div>
          );
        case 'abs':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-teal-50 to-teal-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="20" r="8" fill="#14b8a6" />
                <rect x="47" y="28" width="6" height="30" fill="#14b8a6" />
                <rect x="40" y="35" width="20" height="15" fill="#14b8a6" />
                <rect x="45" y="58" width="5" height="20" fill="#14b8a6" />
                <rect x="52" y="58" width="5" height="20" fill="#14b8a6" />
              </svg>
            </div>
          );
        case 'shoulders':
        case 'traps':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="20" r="8" fill="#eab308" />
                <rect x="47" y="28" width="6" height="30" fill="#eab308" />
                <rect x="30" y="30" width="40" height="8" fill="#eab308" />
                <rect x="45" y="58" width="5" height="20" fill="#eab308" />
                <rect x="52" y="58" width="5" height="20" fill="#eab308" />
              </svg>
            </div>
          );
        case 'cardio':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="50" r="20" fill="#ef4444" className="animate-ping" />
                <circle cx="50" cy="50" r="10" fill="#dc2626" />
              </svg>
            </div>
          );
        case 'forearms':
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <svg width="100" height="100" viewBox="0 0 100 100" className="animate-pulse">
                <circle cx="50" cy="20" r="8" fill="#6b7280" />
                <rect x="47" y="28" width="6" height="25" fill="#6b7280" />
                <rect x="35" y="45" width="30" height="6" fill="#6b7280" className="animate-bounce" />
                <rect x="45" y="58" width="5" height="20" fill="#6b7280" />
                <rect x="52" y="58" width="5" height="20" fill="#6b7280" />
              </svg>
            </div>
          );
        default:
          return (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
              <Activity className="h-12 w-12 text-gray-400 animate-pulse" />
            </div>
          );
      }
    };

    return getBodyPartVisualization();
  };

  return (
    <Card className="overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
      <div className="aspect-video bg-gray-100 relative overflow-hidden">
        {exercise.gifUrl ? (
          <div className="w-full h-full relative">
            <img
              src={exercise.gifUrl}
              alt={exercise.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const loader = target.parentElement?.querySelector('#loading-indicator') as HTMLElement;
                if (loader) loader.innerHTML = '<div class="text-gray-500 text-sm text-center px-2">⚠️ GIF unavailable</div>';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) { fallback.style.display = 'block'; fallback.classList.remove('hidden'); }
              }}
              onLoad={(e) => {
                const target = e.target as HTMLImageElement;
                const loader = target.parentElement?.querySelector('#loading-indicator') as HTMLElement;
                if (loader) loader.style.display = 'none';
              }}
            />
            <div className="hidden w-full h-full">
              {getExerciseVisualization()}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 z-10" id="loading-indicator">
              <div className="text-gray-500 text-sm text-center px-2">📁 Loading GIF...</div>
            </div>
          </div>
        ) : (
          getExerciseVisualization()
        )}
        <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-xs">
          {exercise.gifUrl ? 'Exercise GIF' : 'Exercise Demo'}
        </div>
      </div>

      <CardContent className="p-3 sm:p-6">
        <h3 className="font-semibold text-base sm:text-lg mb-2 line-clamp-2">
          {exercise.name || 'Unknown Exercise'}
        </h3>
        <div className="flex items-center gap-2 mb-3">
          {exercise.bodyPart && (
            <Badge className={getBodyPartColor(exercise.bodyPart)}>
              {exercise.bodyPart}
            </Badge>
          )}
        </div>
        {exercise.instructions && exercise.instructions.length > 0 && (
          <p className="text-gray-600 text-sm line-clamp-3">
            {exercise.instructions[0]}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
