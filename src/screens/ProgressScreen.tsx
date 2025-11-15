import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { workoutStorage } from '../storage/workoutStorage';
import { Workout } from '../types';

const ProgressScreen: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    loadWorkouts();
  }, []);

  const loadWorkouts = async () => {
    const history = await workoutStorage.getWorkoutHistory();
    setWorkouts(history.workouts);
  };

  const clearHistory = () => {
    Alert.alert(
      'Очистить историю',
      'Вы уверены, что хотите удалить все тренировки?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Удалить', 
          style: 'destructive',
          onPress: async () => {
            await workoutStorage.clearHistory();
            setWorkouts([]);
          }
        }
      ]
    );
  };

  if (workouts.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.emptyText}>📊</Text>
        <Text style={styles.emptyText}>Пока нет сохраненных тренировок</Text>
        <Text style={styles.emptySubtext}>
          Начните с экрана "Тренировка"
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>📊 История тренировок</Text>
        <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
          <Ionicons name="trash-outline" size={20} color="#FF3B30" />
          <Text style={styles.clearText}>Очистить</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView}>
        {workouts.map((workout) => (
          <View key={workout.id} style={styles.workoutCard}>
            <View style={styles.workoutHeader}>
              <Text style={styles.exerciseName}>{workout.exerciseName}</Text>
              <Text style={styles.date}>{workout.date}</Text>
            </View>
            
            <View style={styles.setsContainer}>
              {workout.sets.map((set, index) => (
                <View key={set.id} style={styles.setItem}>
                  <Text style={styles.setNumber}>{index + 1}.</Text>
                  <Text style={styles.setDetails}>
                    {set.weight} кг × {set.reps} повторений
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.stats}>
              <Text style={styles.statsText}>
                Всего подходов: {workout.sets.length}
              </Text>
              <Text style={styles.statsText}>
                Макс. вес: {Math.max(...workout.sets.map(s => parseInt(s.weight) || 0))} кг
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  clearText: {
    color: '#FF3B30',
    marginLeft: 4,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  workoutCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  date: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  setsContainer: {
    marginBottom: 12,
  },
  setItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  setNumber: {
    width: 20,
    fontWeight: '600',
    color: '#666',
  },
  setDetails: {
    fontSize: 16,
    color: '#333',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  statsText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 8,
    color: '#666',
  },
  emptySubtext: {
    fontSize: 16,
    textAlign: 'center',
    color: '#999',
  },
});

export default ProgressScreen;
