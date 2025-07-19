# Exercise GIFs Organization

This folder contains organized exercise GIF files by muscle groups for the Sportzal Fitness application.

## Folder Structure

### Primary Muscle Groups
- **`chest/`** - Chest exercises (pectorals, bench press, push-ups, etc.)
- **`back/`** - General back exercises
- **`upper-back/`** - Upper back specific exercises (rhomboids, upper traps)
- **`lower-back/`** - Lower back specific exercises (erector spinae, lower back)
- **`shoulders/`** - Shoulder exercises (deltoids, shoulder press, lateral raises)
- **`traps/`** - Trapezius muscle exercises (shrugs, upright rows)

### Arm Muscle Groups
- **`biceps/`** - Bicep exercises (curls, hammer curls)
- **`triceps/`** - Tricep exercises (dips, tricep extensions)
- **`arms/`** - General arm exercises or compound arm movements
- **`forearms/`** - Forearm specific exercises (wrist curls, grip exercises)

### Lower Body
- **`legs/`** - General leg exercises (squats, lunges, leg press)
- **`calves/`** - Calf muscle exercises (calf raises, calf press)

### Core & Cardio
- **`abs/`** - Abdominal and core exercises (crunches, planks, sit-ups)
- **`cardio/`** - Cardiovascular exercises (running, cycling, HIIT)

## File Naming Convention

When adding GIF files, use this naming pattern:
```
[exercise-name]-[variation].gif
```

Examples:
- `push-up-standard.gif`
- `bicep-curl-dumbbell.gif`
- `squat-bodyweight.gif`
- `plank-standard.gif`

## Usage in Application

These GIFs can be accessed in the application using:
```typescript
import exerciseGif from "@assets/exercise-gifs/[muscle-group]/[exercise-name].gif"
```

Example:
```typescript
import pushUpGif from "@assets/exercise-gifs/chest/push-up-standard.gif"
```

## File Requirements

- **Format**: GIF files only
- **Size**: Optimized for web (recommended under 2MB per file)
- **Dimensions**: Consistent aspect ratio (recommended 400x400 or 500x500)
- **Quality**: Clear demonstration of proper exercise form
- **Duration**: 3-5 seconds loop showing complete exercise movement

## Adding New GIFs

1. Choose the appropriate muscle group folder
2. Name the file following the convention above
3. Ensure the GIF demonstrates proper exercise form
4. Update any relevant exercise data in the application to reference the new GIF

This organization makes it easy to locate and manage exercise demonstration GIFs for the fitness application.