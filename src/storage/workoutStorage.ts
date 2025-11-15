import AsyncStorage from '@react-native-async-storage/async-storage';
import { WorkoutHistory, Workout } from '../types';

const STORAGE_KEY = 'workout_history';

export const workoutStorage = {
  saveWorkout: async (workout: Workout): Promise<void> => {
    try {
      const history = await workoutStorage.getWorkoutHistory();
      history.workouts.unshift(workout);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(history));
    } catch (error) {
      console.error('Ошибка сохранения тренировки:', error);
    }
  },

  getWorkoutHistory: async (): Promise<WorkoutHistory> => {
    try {
      const historyJson = await AsyncStorage.getItem(STORAGE_KEY);
      if (historyJson) {
        return JSON.parse(historyJson);
      }
    } catch (error) {
      console.error('Ошибка загрузки истории:', error);
    }
    
    return { workouts: [] };
  },

  clearHistory: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Ошибка очистки истории:', error);
    }
  }
};
