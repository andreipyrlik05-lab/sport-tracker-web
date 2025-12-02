// 🔥 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDTE7ZKjxmTSxxvnrGB4hzE_3If1nAN1Vc",
    authDomain: "sport-tracker-pro.firebaseapp.com",
    projectId: "sport-tracker-pro",
    storageBucket: "sport-tracker-pro.firebasestorage.app",
    messagingSenderId: "617530545146",
    appId: "1:617530545146:web:0374f5ab27c374ef5c4a43"
};

// Initialize Firebase
let auth, db;
try {
    if (firebase && firebase.initializeApp) {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        console.log('Firebase успешно инициализирован');
    } else {
        console.warn('Firebase SDK не загружен');
    }
} catch (error) {
    console.warn('Firebase недоступен, работаем в оффлайн режиме');
}

// Основной объект приложения
const app = {
    // 🆕 ОБНОВЛЕННАЯ БАЗА УПРАЖНЕНИЙ С АРХИВОМ
    exercisesDatabase: {
        "Грудь": {
            active: [
                "Жим гантелей на прямой скамье",
                "Жим гантелей под углом",
                "Жим от груди в тренажере лежа",
                "Жим от груди в тренажере сидя",
                "Жим штанги на прямой скамье",
                "Жим штанги под углом",
                "Разведение гантелей лёжа",
                "Сведение рук в кроссовере",
                "Сведение рук в тренажёре «Бабочка»"
            ],
            archived: [
                "Пуловер с гантелью",
                "Кроссовер через верхние блоки",
                "Жим в тренажере Смита"
            ]
        },
        "Кардио": {
            active: [
                "Беговая дорожка",
                "Велотренажер",
                "Шаги на платформе (Степ-ап)",
                "Эллипс"
            ],
            archived: [
                "Скакалка",
                "Берпи",
                "Прыжки на бокс"
            ]
        },
        "Ноги": {
            active: [
                "Жим ногами",
                "Жим ноги под углом",
                "Икроножные мышцы сидя",
                "Икроножные мышцы стоя",
                "Приседания со штангой",
                "Разгибание ног (по одной ноге)",
                "Разгибание ног сидя",
                "Сгибание ног лежа",
                "Сгибание ног сидя",
                "Сгибание ног стоя (по одной ноге)"
            ],
            archived: [
                "Выпады с гантелями",
                "Ягодичный мостик"
            ]
        },
        "Плечи": {
            active: [
                "Жим гантелей сидя",
                "Жим над головой в тренажере",
                "Жим штанги с груди (Армейский жим)",
                "Махи в сторону в кроссовере",
                "Махи в сторону в тренажере",
                "Махи гантелей в стороны",
                "Подъем гантелей перед собой",
                "Подъем руки перед собой в кроссовере",
                "Разведение рук в кроссовере на задние дельты",
                "Разведение рук в тренажере на задние дельты",
                "Тяга канатов на задние дельты",
                "Тяга к подбородку в кроссовере",
                "Тяга штанги к подбородку узким хватом"
            ],
            archived: [
                "Жим Арнольда",
                "Тяга штанги к подбородку широким хватом"
            ]
        },
        "Пресс": {
            active: [
                "Планка",
                "Подъем ног в висе",
                "Скручивания",
                "Шаги на платформе (Степ-ап)"
            ],
            archived: [
                "Русские скручивания",
                "Велосипед",
                "Подъем корпуса на римском стуле"
            ]
        },
        "Руки": {
            active: [
                "Концентрированные сгибания на бицепс сидя",
                "Отжимания на трицепс",
                "Подъем гантелей на бицепс",
                "Подъем штанги на бицепс",
                "Разгибание рук в блочном тренажере",
                "Разгибание рук с гантелью в наклоне",
                "Разгибание из-за головы сидя с гантелью",
                "Разгибание из-за головы лежа с гантелью",
                "Разгибание из-за головы лежа с EZ-грифом",
                "Разгибание с канатом на трицепс",
                "Сгибание «Молот»",
                "Сгибание рук в кроссовере",
                "Сгибание рук на скамье Скотта",
                "Сгибание рук с нижнего блока с канатом/рукоятью"
            ],
            archived: [
                "Сгибание Зоттмана",
                "Разгибание из-за головы сидя с EZ-грифом"
            ]
        },
        "Спина": {
            active: [
                "Гиперэкстензия",
                "Гребная тяга",
                "Подтягивания",
                "Тяга вертикального блока к груди",
                "Тяга верхнего блока в тренажёре «Хаммер»",
                "Тяга горизонтального блока к поясу",
                "Тяга блока в тренажёре с упором груди",
                "Тяга штанги в наклоне",
                "Тяга т-грифа с упором"
            ],
            archived: [
                "Тяга гантели в наклоне",
                "Шраги со штангой",
                "Пуловер в блочном тренажере"
            ]
        }
    },

    // Состояние приложения
    state: {
        selectedWorkoutDate: null,
        currentMonth: new Date().getMonth(),
        currentYear: new Date().getFullYear(),
        selectedGroup: null,
        selectedExercise: null,
        sets: [{ weight: '', reps: '', completed: false }],
        editingWorkout: null,
        currentUser: null,
        bodyWeight: '',
        cachedHistory: {},
        theme: 'dark',
        // 🆕 ДЛЯ АРХИВА И ВАРИАЦИЙ
        variations: [],
        searchQuery: '',
        showArchived: {}
    },

    cachedHistory: {},
    muscleGroupChart: null,
    progressChart: null,

    // 🔧 Функция для получения вариантов выполнения упражнения
    getExerciseVariations(exerciseName) {
        const variations = {
            // Вариации для жимов ногами
            "Жим ногами": ["Узкая постановка", "Широкая постановка", "Средняя постановка"],
            "Жим ноги под углом": ["Узкая постановка", "Широкая постановка", "Средняя постановка"],

            // Вариации для подтягиваний и тяг
            "Подтягивания": ["Широкий хват", "Узкий хват", "Обратный хват", "Нейтральный хват"],
            "Тяга вертикального блока к груди": ["Широкий хват", "Узкий хват", "Обратный хват"],
            "Тяга верхнего блока в тренажёре «Хаммер»": ["Широкий хват", "Узкий хват"],
            "Тяга горизонтального блока к поясу": ["Широкий хват", "Узкий хват", "Обратный хват"],
            "Тяга штанги в наклоне": ["Широкий хват", "Узкий хват"],
            "Тяга т-грифа с упором": ["Широкий хват", "Узкий хват"]
        };

        return variations[exerciseName] || [];
    },

    // 🔧 Управление вариациями упражнений
    toggleVariation(variation) {
        const index = this.state.variations.indexOf(variation);
        if (index > -1) {
            this.state.variations.splice(index, 1);
        } else {
            this.state.variations.push(variation);
        }

        console.log('Выбранные вариации:', this.state.variations);
        this.renderVariations();
    },

    // 🆕 СИСТЕМА УПРАВЛЕНИЯ УПРАЖНЕНИЯМИ
    toggleExerciseStatus(group, exercise, isActive) {
        if (!this.exercisesDatabase[group]) return;

        const fromArray = isActive ? this.exercisesDatabase[group].active : this.exercisesDatabase[group].archived;
        const toArray = isActive ? this.exercisesDatabase[group].archived : this.exercisesDatabase[group].active;

        const index = fromArray.indexOf(exercise);
        if (index > -1) {
            fromArray.splice(index, 1);
            toArray.push(exercise);

            this.saveExerciseStructure();
            this.showNotification(exercise + ' ' + (isActive ? 'в архиве' : 'активировано'), 'success');
            this.renderExercises();
        }
    },

    // Сохранение структуры в Firebase
    async saveExerciseStructure() {
        if (!this.state.currentUser || !db) return;

        try {
            await db.collection('exerciseStructures').doc(this.state.currentUser.uid).set({
                exercises: this.exercisesDatabase,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        } catch (error) {
            console.error('Ошибка сохранения структуры:', error);
        }
    },

    // Загрузка структуры из Firebase  
    async loadExerciseStructure() {
        if (!this.state.currentUser || !db) return;

        try {
            const doc = await db.collection('exerciseStructures').doc(this.state.currentUser.uid).get();
            if (doc.exists) {
                const data = doc.data();
                Object.assign(this.exercisesDatabase, data.exercises);
                this.renderGroups();
            }
        } catch (error) {
            console.error('Ошибка загрузки структуры:', error);
        }
    },

    // 🔍 УМНЫЙ ПОИСК
    filterExercises(group, query) {
        if (!query) return this.exercisesDatabase[group].archived;

        return this.exercisesDatabase[group].archived.filter(exercise =>
            exercise.toLowerCase().includes(query.toLowerCase())
        );
    },

    // 👁️ УПРАВЛЕНИЕ ОТОБРАЖЕНИЕМ АРХИВА
    toggleArchivedView(group) {
        this.state.showArchived[group] = !this.state.showArchived[group];
        this.renderExercises();
    },

    // 🔍 ОБРАБОТЧИК ПОИСКА
    handleArchiveSearch(group, query) {
        this.state.searchQuery = query;
        this.renderExercises();
    },

    // 🆕 ИНИЦИАЛИЗАЦИЯ TOUCH СОБЫТИЙ ДЛЯ ANDROID STUDIO
    initTouchEvents() {
        console.log('🖐️ Инициализация touch событий для Android Studio...');

        // Преобразуем touch события в click для эмулятора
        document.addEventListener('touchstart', (e) => {
            const target = e.target;

            // Для навигационных кнопок
            if (target.classList.contains('nav-button') && target.hasAttribute('data-tab')) {
                e.preventDefault();
                const tabName = target.getAttribute('data-tab');
                this.showTab(tabName);
            }

            // Для кнопок групп мышц
            if (target.classList.contains('group-button')) {
                e.preventDefault();
                const groupName = target.textContent;
                this.selectGroup(groupName);
            }

            // Для календарных дат
            if (target.classList.contains('calendar-date')) {
                e.preventDefault();
                const dateString = target.dataset.date;
                if (dateString) {
                    this.showWorkoutHistory(dateString);
                }
            }

            // Для кнопок упражнений (включая кнопки архива)
            if (target.classList.contains('exercise-button') ||
                target.classList.contains('archive-btn') ||
                target.classList.contains('unarchive-btn') ||
                target.classList.contains('toggle-archive-btn')) {
                e.preventDefault();

                if (target.classList.contains('exercise-button')) {
                    const exerciseName = target.getAttribute('data-exercise') ||
                        target.textContent.replace(/^[✅❌]\s*/, '');
                    this.selectExercise(exerciseName);
                }

                // Обработка кнопок архива
                if (target.classList.contains('archive-btn') ||
                    target.classList.contains('unarchive-btn')) {
                    const exercise = target.getAttribute('data-exercise');
                    const action = target.getAttribute('data-action');
                    const group = this.state.selectedGroup;

                    if (exercise && group) {
                        this.toggleExerciseStatus(group, exercise, action === 'archive');
                    }
                }

                // Обработка кнопки показа архива
                if (target.classList.contains('toggle-archive-btn')) {
                    const group = target.getAttribute('data-group');
                    if (group) {
                        this.toggleArchivedView(group);
                    }
                }
            }

        }, { passive: false });

        console.log('✅ Touch events initialized for Android Studio');
    },

    // Инициализация
    async init() {
        console.log('🚀 Инициализация приложения');

        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            await new Promise(resolve => {
                document.addEventListener('DOMContentLoaded', resolve);
            });
        }

        try {
            this.showNotification('Загрузка...', 'info');

            // Инициализация темы
            this.initTheme();

            // 🆕 ДЛЯ ANDROID STUDIO: инициализация touch событий
            this.initTouchEvents();

            // Инициализация обработчиков событий
            this.initEventListeners();

            // Проверяем наличие элементов DOM
            this.checkDOMElements();

            // Слушаем изменения состояния авторизации
            if (auth) {
                auth.onAuthStateChanged((user) => {
                    this.handleAuthStateChange(user);
                });
            } else {
                console.log('Работаем в оффлайн режиме');
                this.state.currentUser = null;
                this.showAuthForm();
            }

            // Рендерим начальные элементы
            this.renderGroups();
            this.updateWorkoutDateDisplay();
            this.renderCalendar();

            // Принудительно показываем первую вкладку
            setTimeout(() => {
                this.showTab('home');
                this.hideNotification();
                console.log('✅ Приложение инициализировано');
            }, 500);

        } catch (error) {
            console.error('Init error:', error);
            this.showNotification('Ошибка загрузки', 'error');
        }
    },

    // Проверка критических элементов DOM
    checkDOMElements() {
        const requiredElements = [
            'calendarGrid',
            'groupsContainer',
            'exercisesContainer',
            'setsContainer',
            'home',
            'workout',
            'analytics'
        ];

        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                console.error(`❌ Критический элемент не найден: #${id}`);
            } else {
                console.log(`✅ Элемент найден: #${id}`);
            }
        });
    },

    // Инициализация темы
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.state.theme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateThemeButton();
    },

    // Переключение темы
    toggleTheme() {
        this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', this.state.theme);
        localStorage.setItem('theme', this.state.theme);
        this.updateThemeButton();
    },

    // Обновление кнопки темы
    updateThemeButton() {
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');

        if (this.state.theme === 'light') {
            icon.textContent = '☀️';
            text.textContent = 'Светлая тема';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Темная тема';
        }
    },

    // Инициализация обработчиков событий
    initEventListeners() {
        // Навигация
        document.querySelectorAll('.nav-button[data-tab]').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });

        // Кнопка выхода
        document.getElementById('logoutButton').addEventListener('click', () => {
            this.signOut();
        });

        // Тема
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Календарь
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.changeMonth(1);
        });

        // Авторизация
        document.getElementById('signInButton').addEventListener('click', () => {
            this.signIn();
        });

        document.getElementById('signUpButton').addEventListener('click', () => {
            this.signUp();
        });

        document.getElementById('forgotPasswordLink').addEventListener('click', (e) => {
            e.preventDefault();
            this.showForgotPassword();
        });

        // Восстановление пароля
        document.getElementById('forgotPasswordModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeForgotPassword();
            }
        });

        // Тренировка
        document.getElementById('addSetButton').addEventListener('click', () => {
            this.addSet();
        });

        document.getElementById('saveWorkoutButton').addEventListener('click', () => {
            this.saveWorkout();
        });

        // Экспорт/импорт
        document.getElementById('exportButton').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importData(e);
        });

        // Вес тела
        document.getElementById('bodyWeightInput').addEventListener('input', (e) => {
            this.state.bodyWeight = e.target.value;
        });

        // Обработчики для модальных окон
        document.getElementById('workoutModal').addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') || e.target.classList.contains('close-modal')) {
                this.closeWorkoutModal();
            }
        });
    },

    // 🔄 УПРАВЛЕНИЕ АВТОРИЗАЦИЕЙ
    handleAuthStateChange(user) {
        console.log('👤 Изменение состояния авторизации:', user ? user.email : 'null');
        this.state.currentUser = user;

        if (user) {
            this.showUserInfo(user);
            this.loadWorkoutsFromFirebase();
            this.loadExerciseStructure();
            this.showNotification('Добро пожаловать, ' + user.email + '!', 'success');
        } else {
            this.showAuthForm();
            this.cachedHistory = {};
            this.renderCalendar();
            this.hideUserData();
        }
    },

    showAuthForm() {
        console.log('🔐 Показ формы авторизации');
        const authSection = document.getElementById('authSection');
        const userInfo = document.getElementById('userInfo');
        const backupSection = document.getElementById('backupSection');
        const logoutBtn = document.getElementById('logoutButton');

        if (authSection) authSection.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (backupSection) backupSection.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'none';
    },

    showUserInfo(user) {
        console.log('👤 Показ информации пользователя');
        const authSection = document.getElementById('authSection');
        const userInfo = document.getElementById('userInfo');
        const userEmail = document.getElementById('userEmail');
        const backupSection = document.getElementById('backupSection');
        const logoutBtn = document.getElementById('logoutButton');

        if (authSection) authSection.style.display = 'none';
        if (userInfo) userInfo.style.display = 'block';
        if (userEmail) userEmail.textContent = user.email;
        if (backupSection) backupSection.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'block';
    },

    hideUserData() {
        const dateWorkouts = document.getElementById('dateWorkouts');
        const motivationBlock = document.getElementById('motivationBlock');

        if (dateWorkouts) dateWorkouts.style.display = 'none';
        if (motivationBlock) motivationBlock.style.display = 'block';
    },

    // 🔐 ФУНКЦИИ ВОССТАНОВЛЕНИЯ ПАРОЛЯ
    showForgotPassword() {
        const modal = document.getElementById('forgotPasswordModal');
        const emailInput = document.getElementById('forgotPasswordEmail');
        const authEmail = document.getElementById('authEmail');

        if (modal) modal.style.display = 'flex';
        if (emailInput && authEmail) {
            emailInput.value = authEmail.value || '';
        }

        const statusElement = document.getElementById('forgotPasswordStatus');
        if (statusElement) {
            statusElement.textContent = '';
            statusElement.className = 'sync-status';
        }
    },

    closeForgotPassword() {
        const modal = document.getElementById('forgotPasswordModal');
        if (modal) modal.style.display = 'none';
    },

    async sendPasswordReset() {
        const email = document.getElementById('forgotPasswordEmail')?.value;
        const statusElement = document.getElementById('forgotPasswordStatus');

        if (!email) {
            if (statusElement) {
                statusElement.textContent = 'Введите ваш email';
                statusElement.className = 'sync-status error';
            }
            return;
        }

        if (!auth) {
            if (statusElement) {
                statusElement.textContent = 'Сервис временно недоступен';
                statusElement.className = 'sync-status error';
            }
            return;
        }

        try {
            if (statusElement) {
                statusElement.textContent = 'Отправка ссылки...';
                statusElement.className = 'sync-status syncing';
            }

            await auth.sendPasswordResetEmail(email);

            if (statusElement) {
                statusElement.textContent = '✅ Ссылка для сброса пароля отправлена на ваш email!';
                statusElement.className = 'sync-status synced';
            }

            setTimeout(() => {
                this.closeForgotPassword();
                this.showNotification('Проверьте вашу почту для сброса пароля', 'success');
            }, 1500);

        } catch (error) {
            console.error('Password reset error:', error);

            if (statusElement) {
                const errorMessage = this.getPasswordResetErrorMessage(error.code);
                statusElement.textContent = errorMessage;
                statusElement.className = 'sync-status error';
            }
        }
    },

    getPasswordResetErrorMessage(errorCode) {
        const messages = {
            'auth/invalid-email': 'Неверный формат email',
            'auth/user-not-found': 'Пользователь с таким email не найден',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
            'auth/network-request-failed': 'Ошибка сети. Проверьте подключение к интернету'
        };
        return messages[errorCode] || 'Произошла ошибка при отправке email';
    },

    // 📝 РЕГИСТРАЦИЯ И ВХОД
    async signUp() {
        const email = document.getElementById('authEmail')?.value;
        const password = document.getElementById('authPassword')?.value;
        const authStatus = document.getElementById('authStatus');

        if (!email || !password) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        if (!auth) {
            this.showNotification('Сервис временно недоступен', 'error');
            return;
        }

        try {
            if (authStatus) {
                authStatus.textContent = 'Регистрация...';
                authStatus.className = 'sync-status syncing';
            }

            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await this.saveUserToFirestore(userCredential.user);

            this.showNotification('Регистрация успешна!', 'success');
            if (authStatus) authStatus.textContent = '';

        } catch (error) {
            console.error('Sign up error:', error);
            if (authStatus) {
                authStatus.textContent = this.getAuthErrorMessage(error.code);
                authStatus.className = 'sync-status error';
            }
        }
    },

    // 🔥 Сохранение пользователя в Firestore
    async saveUserToFirestore(user) {
        if (!db) return;

        try {
            await db.collection('users').doc(user.uid).set({
                email: user.email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp()
            }, { merge: true });
            console.log('Пользователь сохранен/обновлен в Firestore');
        } catch (error) {
            console.error('Ошибка сохранения пользователя в Firestore:', error);
        }
    },

    async signIn() {
        const email = document.getElementById('authEmail')?.value;
        const password = document.getElementById('authPassword')?.value;
        const authStatus = document.getElementById('authStatus');

        if (!email || !password) {
            this.showNotification('Заполните все поля', 'error');
            return;
        }

        if (!auth) {
            this.showNotification('Сервис временно недоступен', 'error');
            return;
        }

        try {
            if (authStatus) {
                authStatus.textContent = 'Вход...';
                authStatus.className = 'sync-status syncing';
            }

            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            await this.saveUserToFirestore(userCredential.user);

            this.showNotification('Вход выполнен!', 'success');
            if (authStatus) authStatus.textContent = '';

        } catch (error) {
            console.error('Sign in error:', error);
            if (authStatus) {
                authStatus.textContent = this.getAuthErrorMessage(error.code);
                authStatus.className = 'sync-status error';
            }
        }
    },

    async signOut() {
        try {
            if (this.unsubscribeWorkouts) {
                this.unsubscribeWorkouts();
            }

            if (auth) {
                await auth.signOut();
            }

            this.showNotification('Вы вышли из системы', 'success');
            
        } catch (error) {
            console.error('Sign out error:', error);
            this.showNotification('Ошибка при выходе', 'error');
        }
    },

    getAuthErrorMessage(errorCode) {
        const messages = {
            'auth/email-already-in-use': 'Email уже используется',
            'auth/invalid-email': 'Неверный формат email',
            'auth/weak-password': 'Пароль слишком простой (минимум 6 символов)',
            'auth/user-not-found': 'Пользователь не найден',
            'auth/wrong-password': 'Неверный пароль',
            'auth/too-many-requests': 'Слишком много попыток. Попробуйте позже',
            'auth/network-request-failed': 'Ошибка сети. Проверьте подключение к интернету',
            'auth/user-disabled': 'Аккаунт заблокирован'
        };
        return messages[errorCode] || 'Произошла ошибка';
    },

    // 🔥 Загрузка тренировок из Firebase
    async loadWorkoutsFromFirebase() {
        if (!this.state.currentUser || !db) return;

        try {
            console.log('📥 Загрузка тренировок из Firebase...');

            this.unsubscribeWorkouts = db.collection('workouts')
                .where('userId', '==', this.state.currentUser.uid)
                .onSnapshot((snapshot) => {
                    this.cachedHistory = {};

                    snapshot.forEach((doc) => {
                        const workout = doc.data();
                        const date = workout.date;

                        if (!this.cachedHistory[date]) {
                            this.cachedHistory[date] = [];
                        }
                        this.cachedHistory[date].push({
                            ...workout,
                            id: doc.id
                        });
                    });

                    this.sortWorkoutsByDate();
                    this.renderCalendar();
                    this.updateAnalytics();

                    console.log('✅ Данные загружены, тренировок:', snapshot.size);
                    this.showNotification('Данные загружены', 'success');
                }, (error) => {
                    console.error('Firestore error:', error);
                    this.showNotification('Ошибка загрузки данных', 'error');
                });

        } catch (error) {
            console.error('Load workouts error:', error);
            this.showNotification('Ошибка загрузки данных', 'error');
        }
    },

    // Сортировка тренировок по дате
    sortWorkoutsByDate() {
        const sortedHistory = {};
        const dates = Object.keys(this.cachedHistory).sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('.').map(Number);
            const [dayB, monthB, yearB] = b.split('.').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateB - dateA;
        });

        dates.forEach(date => {
            sortedHistory[date] = this.cachedHistory[date];
        });

        this.cachedHistory = sortedHistory;
    },

    // Показать вкладку
    showTab(tabName) {
        // Скрыть все вкладки
        document.querySelectorAll('.content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Убрать активный класс со всех кнопок
        document.querySelectorAll('.nav-button').forEach(btn => {
            btn.classList.remove('active');
        });

        // Показать выбранную вкладку
        document.getElementById(tabName).classList.add('active');

        // Добавить активный класс кнопке
        document.querySelector(`.nav-button[data-tab="${tabName}"]`).classList.add('active');

        // Особые действия для вкладок
        if (tabName === 'home') {
            this.renderCalendar();
            const dateWorkouts = document.getElementById('dateWorkouts');
            const motivationBlock = document.getElementById('motivationBlock');
            if (dateWorkouts) dateWorkouts.style.display = 'none';
            if (motivationBlock) motivationBlock.style.display = 'block';
        } else if (tabName === 'analytics') {
            this.updateAnalytics();
        }
    },

    // Рендер групп мышц
    renderGroups() {
        const container = document.getElementById('groupsContainer');
        container.innerHTML = '';

        Object.keys(this.exercisesDatabase).sort().forEach(group => {
            const button = document.createElement('button');
            button.className = 'group-button';
            button.textContent = group;
            button.addEventListener('click', () => {
                this.selectGroup(group);
            });
            container.appendChild(button);
        });
    },

    // Выбор группы мышц
    selectGroup(group) {
        console.log('💪 Выбрана группа:', group);
        this.state.selectedGroup = group;
        this.state.selectedExercise = null;
        this.state.sets = group === "Кардио" ?
            [{ time: '', intensity: '', completed: false }] :
            [{ weight: '', reps: '', completed: false }];
        this.state.variations = [];

        // Обновить выделение
        document.querySelectorAll('.group-button').forEach(btn => {
            btn.classList.remove('selected');
        });
        event.target.classList.add('selected');

        // Показать упражнения
        document.getElementById('exercisesSection').style.display = 'block';
        document.getElementById('setsSection').style.display = 'none';
        document.getElementById('bodyWeightSection').style.display = 'block';

        // Рендерить упражнения
        this.renderExercises();
    },

    // 🆕 ОБНОВЛЕННЫЙ RENDER_EXERCISES С АРХИВОМ
    renderExercises() {
        const container = document.getElementById('exercisesContainer');
        const title = document.getElementById('exercisesTitle');

        if (!container || !title || !this.state.selectedGroup) return;

        const group = this.state.selectedGroup;
        const activeExercises = this.exercisesDatabase[group]?.active || [];
        const archivedExercises = this.exercisesDatabase[group]?.archived || [];
        const showArchived = this.state.showArchived[group];
        const searchQuery = this.state.searchQuery || '';

        title.textContent = `2. Выберите упражнение для ${group}:`;

        let html = '<div class="exercises-stats">' +
            '💪 ' + group + ' (' + activeExercises.length + '/' + (activeExercises.length + archivedExercises.length) + ')' +
            '</div>';

        // Активные упражнения
        activeExercises.forEach(exercise => {
            html +=
                '<div class="exercise-item">' +
                '<button class="exercise-button selected" ' +
                'data-exercise="' + exercise + '">' +
                '✅ ' + exercise +
                '</button>' +
                '<button class="archive-btn" ' +
                'data-exercise="' + exercise + '" data-action="archive">' +
                '📁' +
                '</button>' +
                '</div>';
        });

        // Архивные упражнения
        if (archivedExercises.length > 0) {
            const filteredArchived = searchQuery ?
                this.filterExercises(group, searchQuery) : archivedExercises;

            html +=
                '<div class="archived-section">' +
                '<div class="archived-header">' +
                '<button class="toggle-archive-btn" ' +
                'data-group="' + group + '">' +
                '👁️ ' + (showArchived ? 'Скрыть' : 'Показать') + ' ' + archivedExercises.length + ' скрытых' +
                '</button>' +
                '</div>';

            if (showArchived) {
                html +=
                    '<div class="archive-search">' +
                    '<input type="text" ' +
                    'class="search-input" ' +
                    'placeholder="🔍 Поиск в архиве..." ' +
                    'value="' + searchQuery + '">' +
                    '</div>';

                if (filteredArchived.length > 0) {
                    filteredArchived.forEach(exercise => {
                        html +=
                            '<div class="exercise-item">' +
                            '<button class="exercise-button" ' +
                            'data-exercise="' + exercise + '">' +
                            '❌ ' + exercise +
                            '</button>' +
                            '<button class="unarchive-btn" ' +
                            'data-exercise="' + exercise + '" data-action="unarchive">' +
                            '📂' +
                            '</button>' +
                            '</div>';
                    });
                } else {
                    html += '<div class="no-results">Ничего не найдено</div>';
                }
            }

            html += '</div>';
        }

        container.innerHTML = html;

        // Добавляем обработчики событий
        this.initExerciseEventListeners();
    },

    // 🆕 ОБРАБОТЧИКИ СОБЫТИЙ ДЛЯ АРХИВА
    initExerciseEventListeners() {
        // Выбор упражнения
        document.querySelectorAll('.exercise-button').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const exercise = e.target.getAttribute('data-exercise') ||
                    e.target.textContent.replace(/^[✅❌]\s*/, '');
                this.selectExercise(exercise);
            });
        });

        // Архивация/разархивация
        document.querySelectorAll('.archive-btn, .unarchive-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const exercise = e.target.getAttribute('data-exercise');
                const action = e.target.getAttribute('data-action');
                const group = this.state.selectedGroup;

                if (exercise && group) {
                    this.toggleExerciseStatus(group, exercise, action === 'archive');
                }
            });
        });

        // Переключение просмотра архива
        document.querySelectorAll('.toggle-archive-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const group = e.target.getAttribute('data-group');
                if (group) {
                    this.toggleArchivedView(group);
                }
            });
        });

        // Поиск в архиве
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const group = this.state.selectedGroup;
                const query = e.target.value;
                this.handleArchiveSearch(group, query);
            });
        }
    },

    // Выбор упражнения
    selectExercise(exercise) {
        console.log('🏋️ Выбрано упражнение:', exercise);
        this.state.selectedExercise = exercise;
        this.state.variations = [];

        // Обновляем выделение
        document.querySelectorAll('.exercise-button').forEach(btn => {
            btn.classList.remove('selected');
            const btnExercise = btn.getAttribute('data-exercise') ||
                btn.textContent.replace(/^[✅❌]\s*/, '');
            if (btnExercise === exercise) {
                btn.classList.add('selected');
            }
        });

        // Рендерим подходы
        this.renderSets();
        const setsSection = document.getElementById('setsSection');
        if (setsSection) setsSection.style.display = 'block';

        // Прокручиваем к подходам
        setTimeout(() => {
            if (setsSection) {
                setsSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, 300);
    },

    // 🆕 ОБНОВЛЕННЫЙ RENDER_SETS С ВАРИАЦИЯМИ
    renderSets() {
        const container = document.getElementById('setsContainer');
        const selectedExerciseName = document.getElementById('selectedExerciseName');

        if (!container || !selectedExerciseName) return;

        selectedExerciseName.textContent = this.state.selectedExercise;
        container.innerHTML = '';

        // Добавляем секцию вариаций
        const variations = this.getExerciseVariations(this.state.selectedExercise);
        if (variations.length > 0) {
            const variationsSection = document.createElement('div');
            variationsSection.className = 'variations-section';
            variationsSection.style.marginBottom = '20px';
            variationsSection.innerHTML =
                '<div class="section-title">Варианты выполнения:</div>' +
                '<div class="variations-container" id="variationsContainer"></div>';
            container.appendChild(variationsSection);
        }

        // Рендерим подходы
        if (this.state.selectedGroup === "Кардио") {
            this.state.sets.forEach((set, index) => {
                const cardioElement = document.createElement('div');
                cardioElement.className = 'cardio-container';
                cardioElement.innerHTML = `
                    <div class="cardio-inputs">
                        <div>
                            <div class="input-label">Время (мин)</div>
                            <input type="number" class="time-input" value="${set.time || ''}" 
                                   data-index="${index}" placeholder="0">
                        </div>
                        <div>
                            <div class="input-label">Сложность (1-40)</div>
                            <input type="number" class="intensity-input" value="${set.intensity || ''}" 
                                   data-index="${index}" placeholder="0" min="1" max="40">
                        </div>
                    </div>
                `;
                container.appendChild(cardioElement);
            });
        } else {
            this.state.sets.forEach((set, index) => {
                const setElement = document.createElement('div');
                setElement.className = 'set-container';
                setElement.innerHTML = `
                    <div class="set-inputs">
                        <div>
                            <div class="input-label">Вес (кг)</div>
                            <input type="number" class="weight-input" value="${set.weight || ''}" 
                                   data-index="${index}" placeholder="0" step="0.5">
                        </div>
                        <div>
                            <div class="input-label">Повторения</div>
                            <input type="number" class="reps-input" value="${set.reps || ''}" 
                                   data-index="${index}" placeholder="0">
                        </div>
                        ${this.state.sets.length > 1 ? `
                            <button class="delete-set-btn" data-index="${index}">🗑️</button>
                        ` : ''}
                    </div>
                `;
                container.appendChild(setElement);
            });
        }

        // Рендерим вариации если есть
        if (variations.length > 0) {
            this.renderVariations();
        }

        // Добавляем обработчики для полей ввода
        this.addSetInputListeners();
    },

    // 🆕 РЕНДЕР ВАРИАЦИЙ
    renderVariations() {
        const variationsContainer = document.getElementById('variationsContainer');
        if (!variationsContainer) return;

        const variations = this.getExerciseVariations(this.state.selectedExercise);
        let html = '';

        variations.forEach(variation => {
            const isSelected = this.state.variations.includes(variation);
            html +=
                '<label class="variation-label ' + (isSelected ? 'selected' : '') + '">' +
                '<input type="checkbox" class="variation-checkbox" value="' + variation + '" ' +
                (isSelected ? 'checked' : '') + '>' +
                variation +
                '</label>';
        });

        variationsContainer.innerHTML = html;

        // Добавляем обработчики для чекбоксов
        document.querySelectorAll('.variation-checkbox').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const variation = e.target.value;
                this.toggleVariation(variation);
            });
        });
    },

    // Добавить обработчики для полей ввода
    addSetInputListeners() {
        // Вес и повторения
        document.querySelectorAll('.weight-input, .reps-input, .time-input, .intensity-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                const field = e.target.classList.contains('weight-input') ? 'weight' :
                    e.target.classList.contains('reps-input') ? 'reps' :
                        e.target.classList.contains('time-input') ? 'time' : 'intensity';
                this.updateSet(index, field, e.target.value);
            });
        });

        // Удаление подхода
        document.querySelectorAll('.delete-set-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.deleteSet(index);
            });
        });
    },

    // Обновить подход
    updateSet(index, field, value) {
        if (this.state.sets[index]) {
            this.state.sets[index][field] = value;
        }
    },

    // Добавить подход
    addSet() {
        if (this.state.selectedGroup === "Кардио") {
            this.showNotification('Для кардио доступен только один блок', 'info');
            return;
        }
        this.state.sets.push({ weight: '', reps: '', completed: false });
        this.renderSets();
    },

    // Удалить подход
    deleteSet(index) {
        if (this.state.sets.length > 1) {
            this.state.sets.splice(index, 1);
            this.renderSets();
        }
    },

    // 💾 СОХРАНЕНИЕ ТРЕНИРОВКИ
    async saveWorkout() {
        if (!this.state.currentUser && db) {
            this.showNotification('Сначала войдите в систему', 'error');
            return;
        }

        try {
            let isValid = false;

            if (this.state.selectedGroup === "Кардио") {
                const cardioData = this.state.sets[0];
                isValid = cardioData.time && cardioData.intensity;
                if (!isValid) {
                    this.showNotification('Заполните время и уровень сложности!', 'error');
                    return;
                }
            } else {
                const completedSets = this.state.sets.filter(set => set.weight && set.reps);
                isValid = completedSets.length > 0;
                if (!isValid) {
                    this.showNotification('Добавьте хотя бы один подход!', 'error');
                    return;
                }
            }

            if (!this.state.selectedExercise || !this.state.selectedGroup) {
                this.showNotification('Выберите упражнение и группу мышц!', 'error');
                return;
            }

            const dateString = this.state.selectedWorkoutDate || this.formatDate(new Date());
            const workout = {
                exercise: this.state.selectedExercise,
                muscleGroup: this.state.selectedGroup,
                sets: this.state.sets,
                date: dateString,
                bodyWeight: this.state.bodyWeight || null,
                variations: this.state.variations || []
            };

            if (this.state.currentUser && db) {
                workout.userId = this.state.currentUser.uid;
                workout.createdAt = firebase.firestore.FieldValue.serverTimestamp();
            }

            this.showNotification('Сохранение...', 'info');

            if (this.state.editingWorkout) {
                if (db && this.state.editingWorkout.id) {
                    await db.collection('workouts').doc(this.state.editingWorkout.id).update(workout);
                }
                this.showNotification('Тренировка "' + this.state.selectedExercise + '" обновлена!', 'success');
            } else {
                if (db && this.state.currentUser) {
                    await db.collection('workouts').add(workout);
                    this.showNotification('Тренировка "' + this.state.selectedExercise + '" сохранена в облако!', 'success');
                } else {
                    // Оффлайн режим
                    const localId = 'local_' + Date.now();
                    if (!this.cachedHistory[dateString]) {
                        this.cachedHistory[dateString] = [];
                    }
                    this.cachedHistory[dateString].push({
                        ...workout,
                        id: localId
                    });
                    this.showNotification('Тренировка "' + this.state.selectedExercise + '" сохранена локально!', 'success');
                }
            }

            this.resetWorkoutState();
            await this.updateAnalytics();

            setTimeout(() => {
                this.hideNotification();
                this.showTab('home');
            }, 1000);

        } catch (error) {
            console.error('Save workout error:', error);
            this.showNotification('Ошибка сохранения', 'error');
        }
    },

    resetWorkoutState() {
        console.log('🔄 Сброс состояния тренировки');
        this.state.selectedGroup = null;
        this.state.selectedExercise = null;
        this.state.sets = [{ weight: '', reps: '', completed: false }];
        this.state.editingWorkout = null;
        this.state.bodyWeight = '';
        this.state.variations = [];

        const exercisesSection = document.getElementById('exercisesSection');
        const setsSection = document.getElementById('setsSection');
        const bodyWeightSection = document.getElementById('bodyWeightSection');

        if (exercisesSection) exercisesSection.style.display = 'none';
        if (setsSection) setsSection.style.display = 'none';
        if (bodyWeightSection) bodyWeightSection.style.display = 'none';

        document.querySelectorAll('.group-button, .exercise-button').forEach(btn => {
            btn.classList.remove('selected');
        });
    },

    // 📅 РЕНДЕРИНГ КАЛЕНДАРЯ
    renderCalendar() {
        console.log('📅 Рендеринг календаря...');
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) {
            console.error('❌ Элемент календаря не найден!');
            setTimeout(() => this.renderCalendar(), 100);
            return;
        }

        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        const currentMonthElement = document.getElementById('currentMonth');
        if (currentMonthElement) {
            currentMonthElement.textContent = `${monthNames[this.state.currentMonth]} ${this.state.currentYear}`;
        }

        const firstDay = new Date(this.state.currentYear, this.state.currentMonth, 1);
        const startDate = new Date(firstDay);
        const firstDayOfWeek = firstDay.getDay() || 7;
        startDate.setDate(startDate.getDate() - (firstDayOfWeek - 1));

        calendarGrid.innerHTML = '';

        // Дни недели
        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        const today = new Date();
        const workoutHistory = this.cachedHistory;

        // Даты
        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.dataset.date = this.formatDate(date);
            dateElement.textContent = date.getDate();

            const dateString = this.formatDate(date);
            const hasWorkout = workoutHistory[dateString]?.length > 0;
            const isToday = date.toDateString() === today.toDateString();
            const isCurrentMonth = date.getMonth() === this.state.currentMonth;

            if (!isCurrentMonth) dateElement.classList.add('other-month');
            if (hasWorkout) dateElement.classList.add('has-workout');
            if (isToday) dateElement.classList.add('today');

            dateElement.addEventListener('click', () => {
                this.showWorkoutHistory(dateString);
            });

            calendarGrid.appendChild(dateElement);
        }

        // Для Android Studio: принудительный reflow
        setTimeout(() => {
            calendarGrid.style.display = 'none';
            calendarGrid.offsetHeight;
            calendarGrid.style.display = 'grid';
        }, 10);

        console.log('✅ Календарь отрендерен');
    },

    // Изменить месяц
    changeMonth(direction) {
        this.state.currentMonth += direction;

        if (this.state.currentMonth < 0) {
            this.state.currentMonth = 11;
            this.state.currentYear--;
        } else if (this.state.currentMonth > 11) {
            this.state.currentMonth = 0;
            this.state.currentYear++;
        }

        this.renderCalendar();
    },

    // Форматирование даты
    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}.${month}.${year}`;
    },

    // Показать историю тренировок
    showWorkoutHistory(dateString) {
        console.log('📖 Показ истории тренировок за:', dateString);
        this.state.selectedWorkoutDate = dateString;
        this.updateWorkoutDateDisplay();

        // Выделяем выбранную дату в календаре
        document.querySelectorAll('.calendar-date').forEach(date => {
            date.classList.remove('selected');
            if (date.dataset.date === dateString) {
                date.classList.add('selected');
            }
        });

        const workoutHistory = this.cachedHistory;
        const workouts = workoutHistory[dateString];
        const dateWorkoutsElement = document.getElementById('dateWorkouts');
        const motivationBlock = document.getElementById('motivationBlock');

        if (!dateWorkoutsElement || !motivationBlock) return;

        dateWorkoutsElement.style.display = 'block';
        motivationBlock.style.display = 'none';

        if (!workouts || workouts.length === 0) {
            dateWorkoutsElement.innerHTML =
                '<div class="section-title">На ' + dateString + ' тренировок нет</div>' +
                '<button class="action-btn" onclick="app.addWorkoutToDate(\'' + dateString + '\')">' +
                '+ Добавить тренировку' +
                '</button>';
            return;
        }

        let historyHTML = '<div class="section-title">Тренировки за ' + dateString + ':</div>';

        workouts.forEach((workout, index) => {
            let details = workout.muscleGroup === "Кардио"
                ? `Время: ${workout.sets[0].time} мин, Сложность: ${workout.sets[0].intensity}/40`
                : `Подходов: ${workout.sets.length}`;

            if (workout.bodyWeight) {
                details += `, Вес тела: ${workout.bodyWeight} кг`;
            }

            if (workout.variations && workout.variations.length > 0) {
                details += `, Вариации: ${workout.variations.join(', ')}`;
            }

            historyHTML += `
                <div class="history-item">
                    <div class="history-exercise" onclick="app.viewWorkoutDetails('${dateString}', ${index})">
                        ${workout.exercise}
                    </div>
                    <div class="history-details">${details}</div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="app.editWorkout('${dateString}', ${index})">
                            ✏️ Редактировать
                        </button>
                        <button class="delete-btn" onclick="app.deleteWorkout('${dateString}', ${index})">
                            🗑️ Удалить
                        </button>
                    </div>
                </div>
            `;
        });

        historyHTML += `
            <button class="action-btn" onclick="app.addWorkoutToDate('${dateString}')">
                + Добавить еще
            </button>
        `;

        dateWorkoutsElement.innerHTML = historyHTML;
    },

    // Обновить отображение даты тренировки
    updateWorkoutDateDisplay() {
        const display = document.getElementById('selectedDateText');
        if (display) {
            display.textContent = this.state.selectedWorkoutDate ||
                `Сегодня (${this.formatDate(new Date())})`;
        }
    },

    // Добавить тренировку на дату
    addWorkoutToDate(dateString) {
        this.resetWorkoutState();
        this.state.selectedWorkoutDate = dateString;
        this.updateWorkoutDateDisplay();
        this.showTab('workout');
    },

    // Редактировать тренировку
    editWorkout(dateString, workoutIndex) {
        const workout = this.cachedHistory[dateString][workoutIndex];

        this.showTab('workout');
        this.state.selectedGroup = workout.muscleGroup;
        this.state.selectedExercise = workout.exercise;
        this.state.sets = workout.sets;
        this.state.editingWorkout = { date: dateString, index: workoutIndex };
        this.state.selectedWorkoutDate = dateString;
        this.state.bodyWeight = workout.bodyWeight || '';
        this.state.variations = workout.variations || [];

        this.updateWorkoutDateDisplay();
        document.getElementById('exercisesSection').style.display = 'block';
        document.getElementById('setsSection').style.display = 'block';
        document.getElementById('bodyWeightSection').style.display = 'block';

        document.getElementById('bodyWeightInput').value = this.state.bodyWeight;

        // Выделяем группу
        document.querySelectorAll('.group-button').forEach(btn => {
            btn.classList.toggle('selected', btn.textContent === this.state.selectedGroup);
        });

        this.renderExercises();

        // Выделяем упражнение
        setTimeout(() => {
            document.querySelectorAll('.exercise-button').forEach(btn => {
                btn.classList.toggle('selected', btn.textContent === this.state.selectedExercise);
            });
            this.renderSets();
        }, 100);
    },

    // Удалить тренировку
    deleteWorkout(dateString, workoutIndex) {
        if (!confirm('Удалить эту тренировку?')) return;

        const workout = this.cachedHistory[dateString][workoutIndex];

        // Удаляем из Firebase если есть подключение и это не локальная запись
        if (db && workout.id && !workout.id.startsWith('local_')) {
            db.collection('workouts').doc(workout.id).delete();
        }

        // Удаляем из локального кэша
        this.removeWorkoutFromCache(dateString, workoutIndex);

        this.renderCalendar();
        this.showWorkoutHistory(dateString);
        this.showNotification('Тренировка удалена!', 'success');
    },

    // 🔥 НОВЫЙ МЕТОД ДЛЯ УДАЛЕНИЯ ИЗ ЛОКАЛЬНОГО КЭША
    removeWorkoutFromCache(dateString, workoutIndex) {
        if (this.cachedHistory[dateString] && this.cachedHistory[dateString][workoutIndex]) {
            this.cachedHistory[dateString].splice(workoutIndex, 1);

            if (this.cachedHistory[dateString].length === 0) {
                delete this.cachedHistory[dateString];
            }

            console.log('Локальный кэш обновлен после удаления');
        }
    },

    // Просмотр деталей тренировки
    viewWorkoutDetails(dateString, workoutIndex) {
        const workout = this.cachedHistory[dateString][workoutIndex];

        document.getElementById('modalExerciseName').textContent = workout.exercise;

        let detailsHTML = '<div class="workout-details">';

        if (workout.bodyWeight) {
            detailsHTML += `
                <div class="workout-set">
                    <div>Вес тела</div>
                    <div>${workout.bodyWeight} кг</div>
                </div>
            `;
        }

        if (workout.variations && workout.variations.length > 0) {
            detailsHTML += `
                <div class="workout-set">
                    <div>Варианты выполнения</div>
                    <div>${workout.variations.join(', ')}</div>
                </div>
            `;
        }

        if (workout.muscleGroup === "Кардио") {
            const cardioData = workout.sets[0];
            detailsHTML += `
                <div class="workout-set">
                    <div>Время</div>
                    <div>${cardioData.time} минут</div>
                </div>
                <div class="workout-set">
                    <div>Сложность</div>
                    <div>${cardioData.intensity}/40</div>
                </div>
            `;
        } else {
            workout.sets.forEach((set, index) => {
                if (set.weight || set.reps) {
                    detailsHTML += `
                        <div class="workout-set">
                            <div>Подход ${index + 1}</div>
                            <div>${set.weight} кг × ${set.reps} повторений</div>
                        </div>
                    `;
                }
            });
        }

        detailsHTML += '</div>';
        document.getElementById('workoutDetails').innerHTML = detailsHTML;
        document.getElementById('workoutModal').style.display = 'flex';
    },

    // Закрыть модальное окно тренировки
    closeWorkoutModal() {
        document.getElementById('workoutModal').style.display = 'none';
    },

    // Обновить аналитику
    updateAnalytics() {
        const allWorkouts = this.getAllWorkouts();

        // Общая статистика
        document.getElementById('totalWorkouts').textContent = allWorkouts.length;

        const thisMonth = new Date().getMonth();
        const monthWorkouts = allWorkouts.filter(workout => {
            const [, month] = workout.date.split('.');
            return parseInt(month) - 1 === thisMonth;
        });
        document.getElementById('monthWorkouts').textContent = monthWorkouts.length;

        const totalSets = allWorkouts.reduce((sum, workout) => sum + workout.sets.length, 0);
        document.getElementById('totalSets').textContent = totalSets;

        // Средний вес
        const weights = [];
        allWorkouts.forEach(workout => {
            workout.sets.forEach(set => {
                if (set.weight && parseFloat(set.weight) > 0) {
                    weights.push(parseFloat(set.weight));
                }
            });
        });

        const avgWeight = weights.length > 0
            ? (weights.reduce((a, b) => a + b, 0) / weights.length).toFixed(1)
            : '0';
        document.getElementById('avgWeight').textContent = avgWeight;

        // Обновляем графики
        this.updateCharts(allWorkouts);
    },

    // Получить все тренировки
    getAllWorkouts() {
        const allWorkouts = [];
        Object.values(this.cachedHistory).forEach(workouts => {
            allWorkouts.push(...workouts);
        });
        return allWorkouts;
    },

    // Обновить графики
    updateCharts(allWorkouts) {
        // График групп мышц
        const muscleGroups = {};
        allWorkouts.forEach(workout => {
            muscleGroups[workout.muscleGroup] = (muscleGroups[workout.muscleGroup] || 0) + 1;
        });

        const muscleCtx = document.getElementById('muscleGroupChart');
        if (muscleCtx && typeof Chart !== 'undefined') {
            if (this.muscleGroupChart) {
                this.muscleGroupChart.destroy();
            }

            this.muscleGroupChart = new Chart(muscleCtx.getContext('2d'), {
                type: 'doughnut',
                data: {
                    labels: Object.keys(muscleGroups),
                    datasets: [{
                        data: Object.values(muscleGroups),
                        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FF6384']
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // График прогресса
        const progressCtx = document.getElementById('progressChart');
        if (progressCtx && typeof Chart !== 'undefined') {
            const lastWorkouts = allWorkouts.slice(-10).reverse();

            if (this.progressChart) {
                this.progressChart.destroy();
            }

            this.progressChart = new Chart(progressCtx.getContext('2d'), {
                type: 'line',
                data: {
                    labels: lastWorkouts.map((_, i) => `Тренировка ${i + 1}`),
                    datasets: [{
                        label: 'Суммарный вес (кг)',
                        data: lastWorkouts.map(workout =>
                            workout.sets.reduce((sum, set) => sum + (parseFloat(set.weight) || 0), 0)
                        ),
                        borderColor: '#007AFF',
                        backgroundColor: 'rgba(0, 122, 255, 0.1)',
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    },

    // Экспорт данных
    exportData() {
        try {
            const data = this.cachedHistory;
            if (!data || Object.keys(data).length === 0) {
                this.showNotification('Нет данных для экспорта', 'error');
                return;
            }

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `sport-tracker-backup-${this.formatDate(new Date())}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('Данные экспортированы!', 'success');
        } catch (error) {
            this.showNotification('Ошибка экспорта', 'error');
        }
    },

    // Импорт данных
    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (!confirm('Перезаписать текущие данные?')) return;

                this.cachedHistory = data;
                this.renderCalendar();
                this.updateAnalytics();
                this.showNotification('Данные импортированы!', 'success');
            } catch (error) {
                this.showNotification('Неверный формат файла', 'error');
            }
        };
        reader.readAsText(file);
    },

    // 🔥 ИСПРАВЛЕННЫЙ МЕТОД ДЛЯ УВЕДОМЛЕНИЙ
    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        
        // Скрываем текущее уведомление
        notification.classList.remove('show');
        
        // Даем время для завершения анимации скрытия
        setTimeout(() => {
            // Устанавливаем новый текст и тип
            notification.textContent = message;
            notification.className = `notification ${type}`;
            
            // Показываем уведомление
            setTimeout(() => {
                notification.classList.add('show');
            }, 10);
            
            // Автоматически скрываем через 3 секунды
            setTimeout(() => {
                if (notification.textContent === message) {
                    notification.classList.remove('show');
                }
            }, 3000);
            
        }, 300);
    },

    // Показать лоадер
    showLoader() {
        document.getElementById('loader').classList.add('show');
    },

    // Скрыть лоадер
    hideLoader() {
        document.getElementById('loader').classList.remove('show');
    },

    // Скрыть уведомление
    hideNotification() {
        const notification = document.getElementById('notification');
        notification.classList.remove('show');
    }
};

// Инициализация при загрузке
window.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Для отладки
window.app = app;

// Дополнительные обработчики событий
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register('./service-worker.js')
            .then(function (registration) {
                console.log('ServiceWorker зарегистрирован успешно: ', registration.scope);
            })
            .catch(function (error) {
                console.log('Ошибка регистрации ServiceWorker: ', error);
            });
    });
}

// Обнаружение оффлайн режима
window.addEventListener('online', function () {
    console.log('Приложение онлайн');
    app.showNotification('✅ Соединение восстановлено', 'success');
});

window.addEventListener('offline', function () {
    console.log('Приложение оффлайн');
    app.showNotification('⚠️ Работаем без интернета', 'warning');
});