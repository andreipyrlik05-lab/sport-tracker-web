export interface ExerciseSet {
  id: string;
  weight: string;
  reps: string;
}

export interface Workout {
  id: string;
  date: string;
  exerciseName: string;
  sets: ExerciseSet[];
}

export interface WorkoutHistory {
  workouts: Workout[];
}
