import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { workoutStorage } from '../storage/workoutStorage';
import { ExerciseSet, Workout } from '../types';

const WorkoutScreen: React.FC = () => {
  const [exerciseName, setExerciseName] = useState('');
  const [sets, setSets] = useState<ExerciseSet[]>([
    { id: '1', weight: '', reps: '' }
  ]);

  const addSet = () => {
    const newSet: ExerciseSet = {
      id: Date.now().toString(),
      weight: '',
      reps: ''
    };
    setSets([...sets, newSet]);
  };

  const updateSet = (id: string, field: 'weight' | 'reps', value: string) => {
    setSets(sets.map(set => 
      set.id === id ? { ...set, [field]: value } : set
    ));
  };

  const removeSet = (id: string) => {
    if (sets.length > 1) {
      setSets(sets.filter(set => set.id !== id));
    }
  };

  const saveWorkout = async () => {
    if (!exerciseName.trim()) {
      Alert.alert('Ошибка', 'Введите название упражнения');
      return;
    }

    const validSets = sets.filter(set => set.weight && set.reps);
    if (validSets.length === 0) {
      Alert.alert('Ошибка', 'Добавьте хотя бы один подход');
      return;
    }

    const workout: Workout = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString('ru-RU'),
      exerciseName: exerciseName.trim(),
      sets: validSets
    };

    await workoutStorage.saveWorkout(workout);
    
    Alert.alert('Успех', 'Тренировка сохранена!');
    setExerciseName('');
    setSets([{ id: '1', weight: '', reps: '' }]);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🏋️ Новая тренировка</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Упражнение:</Text>
        <TextInput
          style={styles.textInput}
          placeholder="Например: Жим штанги лежа"
          value={exerciseName}
          onChangeText={setExerciseName}
        />
      </View>

      <Text style={styles.sectionTitle}>Подходы:</Text>
      {sets.map((set, index) => (
        <View key={set.id} style={styles.setRow}>
          <Text style={styles.setNumber}>{index + 1}.</Text>
          <TextInput
            style={[styles.input, styles.weightInput]}
            placeholder="Вес"
            keyboardType="numeric"
            value={set.weight}
            onChangeText={(value) => updateSet(set.id, 'weight', value)}
          />
          <Text style={styles.xText}>×</Text>
          <TextInput
            style={[styles.input, styles.repsInput]}
            placeholder="Повт."
            keyboardType="numeric"
            value={set.reps}
            onChangeText={(value) => updateSet(set.id, 'reps', value)}
          />
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => removeSet(set.id)}
          >
            <Ionicons name="close-circle" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity style={styles.addButton} onPress={addSet}>
        <Ionicons name="add-circle" size={20} color="#007AFF" />
        <Text style={styles.addButtonText}>Добавить подход</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.saveButton} onPress={saveWorkout}>
        <Text style={styles.saveButtonText}>💾 Сохранить тренировку</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  setNumber: {
    width: 24,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9f9f9',
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#eee',
  },
  weightInput: {
    width: 60,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  repsInput: {
    width: 50,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  xText: {
    fontWeight: 'bold',
    marginHorizontal: 4,
  },
  removeButton: {
    marginLeft: 'auto',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#007AFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default WorkoutScreen;
