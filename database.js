// database.js - Полная система базы данных для трекера
class SportTrackerDatabase {
    constructor() {
        this.dbName = 'SportTrackerAdvanced';
        this.version = 3;
        this.db = null;
    }

    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(this.dbName, this.version);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                this.db = request.result;
                console.log('✅ База данных инициализирована');
                resolve(this.db);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                console.log('🔄 Обновление структуры базы данных...');
                this.createStores(db);
            };
        });
    }

    createStores(db) {
        // 🏋️ Тренировки
        if (!db.objectStoreNames.contains('workouts')) {
            const store = db.createObjectStore('workouts', { 
                keyPath: 'id', 
                autoIncrement: true 
            });
            store.createIndex('date', 'date', { unique: false });
            store.createIndex('muscleGroup', 'muscleGroup', { unique: false });
            store.createIndex('exercise', 'exercise', { unique: false });
            store.createIndex('year_month', 'year_month', { unique: false });
        }

        // 📈 Ежедневный прогресс
        if (!db.objectStoreNames.contains('daily_progress')) {
            const store = db.createObjectStore('daily_progress', {
                keyPath: 'id'
            });
            store.createIndex('date', 'date', { unique: true });
            store.createIndex('year_month', 'year_month', { unique: false });
        }

        // 💪 Максимальные веса
        if (!db.objectStoreNames.contains('exercise_max_weights')) {
            const store = db.createObjectStore('exercise_max_weights', {
                keyPath: 'id'
            });
            store.createIndex('exercise', 'exercise', { unique: false });
            store.createIndex('date', 'date', { unique: false });
        }

        // 🎯 Личные рекорды
        if (!db.objectStoreNames.contains('personal_records')) {
            const store = db.createObjectStore('personal_records', {
                keyPath: 'id',
                autoIncrement: true
            });
            store.createIndex('exercise', 'exercise', { unique: false });
            store.createIndex('date', 'date', { unique: false });
        }

        // 📊 Статистика по группам мышц
        if (!db.objectStoreNames.contains('muscle_group_stats')) {
            const store = db.createObjectStore('muscle_group_stats', {
                keyPath: 'id'
            });
            store.createIndex('muscleGroup', 'muscleGroup', { unique: false });
            store.createIndex('year_month', 'year_month', { unique: false });
        }

        // 🔄 История прогресса
        if (!db.objectStoreNames.contains('progress_history')) {
            const store = db.createObjectStore('progress_history', {
                keyPath: 'id'
            });
            store.createIndex('exercise', 'exercise', { unique: false });
            store.createIndex('date', 'date', { unique: false });
        }
    }

    // 💾 Сохранить тренировку и обновить всю статистику
    async saveCompleteWorkout(workoutData) {
        const transaction = this.db.transaction([
            'workouts', 
            'daily_progress', 
            'exercise_max_weights',
            'personal_records',
            'muscle_group_stats',
            'progress_history'
        ], 'readwrite');

        try {
            // 1. Сохраняем основную тренировку
            const workoutId = await this.saveWorkout(workoutData, transaction);
            
            // 2. Обновляем ежедневную статистику
            await this.updateDailyProgress(workoutData, transaction);
            
            // 3. Обновляем максимальные веса
            await this.updateExerciseMaxWeights(workoutData, transaction);
            
            // 4. Проверяем личные рекорды
            await this.checkPersonalRecords(workoutData, transaction);
            
            // 5. Обновляем статистику по группам мышц
            await this.updateMuscleGroupStats(workoutData, transaction);
            
            // 6. Сохраняем в историю прогресса
            await this.saveProgressHistory(workoutData, transaction);
            
            console.log('✅ Все данные тренировки сохранены');
            return workoutId;
            
        } catch (error) {
            console.error('❌ Ошибка сохранения тренировки:', error);
            throw error;
        }
    }

    // 🏋️ Сохранить тренировку
    async saveWorkout(workout, transaction) {
        return new Promise((resolve, reject) => {
            const store = transaction.objectStore('workouts');
            const date = new Date().toISOString().split('T')[0];
            const yearMonth = date.substring(0, 7);
            
            const workoutRecord = {
                ...workout,
                date: date,
                year_month: yearMonth,
                timestamp: new Date().toISOString(),
                totalVolume: workout.sets.reduce((sum, set) => 
                    sum + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0),
                completedSets: workout.sets.filter(set => set.completed).length,
                totalSets: workout.sets.length
            };
            
            const request = store.add(workoutRecord);
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    }

    // 📈 Обновить ежедневный прогресс
    async updateDailyProgress(workout, transaction) {
        return new Promise((resolve) => {
            const store = transaction.objectStore('daily_progress');
            const today = new Date().toISOString().split('T')[0];
            const yearMonth = today.substring(0, 7);
            
            // Получаем текущую запись за день
            const getRequest = store.get(today);
            getRequest.onsuccess = () => {
                const existingRecord = getRequest.result;
                
                const completedSets = workout.sets.filter(set => set.completed);
                const workoutVolume = completedSets.reduce((sum, set) => 
                    sum + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0);
                
                const dailyRecord = existingRecord || {
                    id: today,
                    date: today,
                    year_month: yearMonth,
                    totalWorkouts: 0,
                    totalVolume: 0,
                    totalSets: 0,
                    muscleGroups: {}
                };
                
                // Обновляем статистику
                dailyRecord.totalWorkouts += 1;
                dailyRecord.totalVolume += workoutVolume;
                dailyRecord.totalSets += completedSets.length;
                
                // Обновляем группы мышц
                if (!dailyRecord.muscleGroups[workout.muscleGroup]) {
                    dailyRecord.muscleGroups[workout.muscleGroup] = 0;
                }
                dailyRecord.muscleGroups[workout.muscleGroup] += 1;
                
                const putRequest = store.put(dailyRecord);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => resolve();
            };
            getRequest.onerror = () => resolve();
        });
    }

    // 💪 Обновить максимальные веса
    async updateExerciseMaxWeights(workout, transaction) {
        return new Promise((resolve) => {
            const store = transaction.objectStore('exercise_max_weights');
            const today = new Date().toISOString().split('T')[0];
            
            const completedSets = workout.sets.filter(set => set.completed);
            if (completedSets.length === 0) {
                resolve();
                return;
            }
            
            const maxWeight = Math.max(...completedSets.map(set => parseFloat(set.weight) || 0));
            
            const maxWeightRecord = {
                id: `${workout.exercise}_${today}`,
                exercise: workout.exercise,
                date: today,
                maxWeight: maxWeight,
                muscleGroup: workout.muscleGroup,
                timestamp: new Date().toISOString()
            };
            
            const request = store.put(maxWeightRecord);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
        });
    }

    // 🎯 Проверить личные рекорды
    async checkPersonalRecords(workout, transaction) {
        return new Promise((resolve) => {
            const recordsStore = transaction.objectStore('personal_records');
            const maxWeightsStore = transaction.objectStore('exercise_max_weights');
            
            const completedSets = workout.sets.filter(set => set.completed);
            if (completedSets.length === 0) {
                resolve();
                return;
            }
            
            const currentMax = Math.max(...completedSets.map(set => parseFloat(set.weight) || 0));
            
            // Получаем историю весов для этого упражнения
            const request = maxWeightsStore.index('exercise').getAll(workout.exercise);
            request.onsuccess = () => {
                const exerciseWeights = request.result || [];
                const historicalMax = exerciseWeights.length > 0 ? 
                    Math.max(...exerciseWeights.map(item => item.maxWeight || 0)) : 0;
                
                // Если это новый рекорд
                if (currentMax > historicalMax) {
                    const record = {
                        exercise: workout.exercise,
                        weight: currentMax,
                        date: new Date().toISOString().split('T')[0],
                        muscleGroup: workout.muscleGroup,
                        timestamp: new Date().toISOString(),
                        isPersonalRecord: true
                    };
                    recordsStore.add(record);
                    console.log('🎯 Новый личный рекорд!', record);
                }
                resolve();
            };
            request.onerror = () => resolve();
        });
    }

    // 📊 Обновить статистику по группам мышц
    async updateMuscleGroupStats(workout, transaction) {
        return new Promise((resolve) => {
            const store = transaction.objectStore('muscle_group_stats');
            const today = new Date().toISOString().split('T')[0];
            const yearMonth = today.substring(0, 7);
            const id = `${workout.muscleGroup}_${yearMonth}`;
            
            // Получаем текущую статистику
            const getRequest = store.get(id);
            getRequest.onsuccess = () => {
                const existingStats = getRequest.result;
                
                const completedSets = workout.sets.filter(set => set.completed);
                const workoutVolume = completedSets.reduce((sum, set) => 
                    sum + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0);
                
                const stats = existingStats || {
                    id: id,
                    muscleGroup: workout.muscleGroup,
                    year_month: yearMonth,
                    workoutCount: 0,
                    totalVolume: 0,
                    totalSets: 0,
                    lastWorkout: today
                };
                
                stats.workoutCount += 1;
                stats.totalVolume += workoutVolume;
                stats.totalSets += completedSets.length;
                stats.lastWorkout = today;
                
                const putRequest = store.put(stats);
                putRequest.onsuccess = () => resolve();
                putRequest.onerror = () => resolve();
            };
            getRequest.onerror = () => resolve();
        });
    }

    // 🔄 Сохранить в историю прогресса
    async saveProgressHistory(workout, transaction) {
        return new Promise((resolve) => {
            const store = transaction.objectStore('progress_history');
            const today = new Date().toISOString().split('T')[0];
            const id = `${workout.exercise}_${today}`;
            
            const completedSets = workout.sets.filter(set => set.completed);
            const workoutVolume = completedSets.reduce((sum, set) => 
                sum + (parseFloat(set.weight) || 0) * (parseInt(set.reps) || 0), 0);
            
            const maxWeight = Math.max(...completedSets.map(set => parseFloat(set.weight) || 0));
            
            const historyRecord = {
                id: id,
                exercise: workout.exercise,
                date: today,
                volume: workoutVolume,
                maxWeight: maxWeight,
                setsCount: completedSets.length,
                muscleGroup: workout.muscleGroup
            };
            
            const request = store.put(historyRecord);
            request.onsuccess = () => resolve();
            request.onerror = () => resolve();
        });
    }

    // 📅 Получить тренировки за период
    async getWorkoutsByDateRange(startDate, endDate) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workouts'], 'readonly');
            const store = transaction.objectStore('workouts');
            const request = store.getAll();
            
            request.onsuccess = () => {
                const allWorkouts = request.result || [];
                const filtered = allWorkouts.filter(workout => {
                    return workout.date >= startDate && workout.date <= endDate;
                });
                resolve(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
            };
            request.onerror = () => reject(request.error);
        });
    }

    // 💪 Получить прогресс по упражнению
    async getExerciseProgress(exercise, days = 30) {
        const endDate = new Date().toISOString().split('T')[0];
        const startDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        
        const history = await new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['progress_history'], 'readonly');
            const store = transaction.objectStore('progress_history');
            const index = store.index('exercise');
            const request = index.getAll(exercise);
            
            request.onsuccess = () => {
                const allData = request.result || [];
                const filtered = allData.filter(item => 
                    item.date >= startDate && item.date <= endDate
                );
                resolve(filtered.sort((a, b) => new Date(a.date) - new Date(b.date)));
            };
            request.onerror = () => reject(request.error);
        });
        
        return this.analyzeProgress(history);
    }

    // 📈 Анализ прогресса
    analyzeProgress(progressData) {
        if (progressData.length === 0) {
            return {
                hasData: false,
                message: 'Недостаточно данных для анализа'
            };
        }
        
        const volumes = progressData.map(p => p.volume);
        const weights = progressData.map(p => p.maxWeight);
        
        return {
            hasData: true,
            totalWorkouts: progressData.length,
            averageVolume: volumes.reduce((a, b) => a + b, 0) / volumes.length,
            maxVolume: Math.max(...volumes),
            averageWeight: weights.reduce((a, b) => a + b, 0) / weights.length,
            maxWeight: Math.max(...weights),
            volumeTrend: this.calculateTrend(volumes),
            weightTrend: this.calculateTrend(weights),
            consistency: this.calculateConsistency(progressData)
        };
    }

    // 📊 Рассчитать тренд
    calculateTrend(data) {
        if (data.length < 2) return 'stable';
        
        const first = data[0];
        const last = data[data.length - 1];
        const change = ((last - first) / first) * 100;
        
        if (change > 10) return 'up';
        if (change < -10) return 'down';
        return 'stable';
    }

    // 🎯 Рассчитать консистентность
    calculateConsistency(progressData) {
        if (progressData.length < 2) return 0;
        
        const dates = progressData.map(p => new Date(p.date));
        const gaps = [];
        
        for (let i = 1; i < dates.length; i++) {
            const gap = (dates[i] - dates[i-1]) / (1000 * 60 * 60 * 24);
            gaps.push(gap);
        }
        
        const avgGap = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        return Math.max(0, 100 - (avgGap * 10));
    }
}

// Создаем глобальный экземпляр базы данных
const sportDatabase = new SportTrackerDatabase();
