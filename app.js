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
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

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
                "Ягодичный мостик",
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
                "Разгибание из-за  головы сидя с гантелью",
                "Разгибание из-за  головы лежа с гантелью",
                "Разгибание из-за головы лежа с EZ-грифом",
                "Разгибание с канатом на трицепс",
                "Сгибание «Молот» («Молотки»)",
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
        variations: [],
        // 🆕 СОСТОЯНИЕ ДЛЯ УПРАВЛЕНИЯ АРХИВОМ
        searchQuery: '',
        showArchived: {}
    },

    cachedHistory: {},
    muscleGroupChart: null,
    progressChart: null,
    unsubscribeWorkouts: null,

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
    },

    // 🆕 СИСТЕМА УПРАВЛЕНИЯ УПРАЖНЕНИЯМИ

    // Мгновенное переключение статуса упражнения
    toggleExerciseStatus(group, exercise, isActive) {
        if (!this.exercisesDatabase[group]) return;

        const fromArray = isActive ? this.exercisesDatabase[group].active : this.exercisesDatabase[group].archived;
        const toArray = isActive ? this.exercisesDatabase[group].archived : this.exercisesDatabase[group].active;

        const index = fromArray.indexOf(exercise);
        if (index > -1) {
            fromArray.splice(index, 1);
            toArray.push(exercise);

            // Авто-сохранение в Firebase
            this.saveExerciseStructure();

            this.showNotification(exercise + ' ' + (isActive ? 'в архиве' : 'активировано'));
            this.renderExercises(); // Мгновенное обновление UI
        }
    },

    // Сохранение структуры в Firebase
    async saveExerciseStructure() {
        if (!this.state.currentUser) return;

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
        if (!this.state.currentUser) return;

        try {
            const doc = await db.collection('exerciseStructures').doc(this.state.currentUser.uid).get();
            if (doc.exists) {
                const data = doc.data();
                Object.assign(this.exercisesDatabase, data.exercises);
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
        this.renderExercises(); // Локальная фильтрация без перезагрузки
    },

    // ➕ МОДАЛКА ДЛЯ ДОБАВЛЕНИЯ УПРАЖНЕНИЯ
    showAddCustomExerciseModal(group) {
        const exerciseName = prompt('Введите название нового упражнения для ' + group + ':');
        if (exerciseName && exerciseName.trim()) {
            this.addCustomExercise(group, exerciseName.trim());
        }
    },

    // ДОБАВЛЕНИЕ КАСТОМНОГО УПРАЖНЕНИЯ
    addCustomExercise(group, exerciseName) {
        if (!this.exercisesDatabase[group]) {
            this.exercisesDatabase[group] = { active: [], archived: [] };
        }

        this.exercisesDatabase[group].active.push(exerciseName);
        this.saveExerciseStructure();
        this.renderExercises();
        this.showNotification(exerciseName + " добавлено!");
    },

    async init() {
        try {
            this.showNotification('Загрузка...', 'info');

            // Инициализация темы
            this.initTheme();

            // Инициализация обработчиков навигации
            this.initNavigation();

            // Инициализация валидации полей ввода
            this.initInputValidation();

            // Слушаем изменения состояния авторизации
            auth.onAuthStateChanged((user) => {
                this.handleAuthStateChange(user);
            });

            // Обрабатываем возможный сброс пароля из URL
            this.handlePasswordReset();

            this.renderGroups();
            this.updateWorkoutDateDisplay();
            setTimeout(() => this.hideNotification(), 2000);
        } catch (error) {
            this.showNotification('Ошибка загрузки', 'error');
            console.error('Init error:', error);
        }
    },

    // 🔧 ИНИЦИАЛИЗАЦИЯ ВАЛИДАЦИИ ПОЛЕЙ ВВОДА
    initInputValidation() {
        // Обработчики для всех числовых полей ввода
        document.addEventListener('input', (e) => {
            // Вес (допускает цифры, точку и запятую)
            if (e.target.classList.contains('weight-input') ||
                e.target.classList.contains('body-weight-input')) {
                this.validateWeightInput(e.target);
            }

            // Повторения, время, интенсивность (только целые числа)
            if (e.target.classList.contains('reps-input') ||
                e.target.classList.contains('time-input') ||
                e.target.classList.contains('intensity-input')) {
                this.validateIntegerInput(e.target);
            }
        });

        // Обработчики для вставки текста
        document.addEventListener('paste', (e) => {
            if (e.target.classList.contains('weight-input') ||
                e.target.classList.contains('body-weight-input') ||
                e.target.classList.contains('reps-input') ||
                e.target.classList.contains('time-input') ||
                e.target.classList.contains('intensity-input')) {
                e.preventDefault();
                this.handlePasteIntoNumberField(e);
            }
        });

        // Обработчики для событий клавиатуры
        document.addEventListener('keydown', (e) => {
            if (e.target.classList.contains('weight-input') ||
                e.target.classList.contains('body-weight-input') ||
                e.target.classList.contains('reps-input') ||
                e.target.classList.contains('time-input') ||
                e.target.classList.contains('intensity-input')) {
                this.handleKeydownOnNumberField(e);
            }
        });
    },

    // 🔧 ВАЛИДАЦИЯ ПОЛЯ ВВОДА ВЕСА
    validateWeightInput(input) {
        const cursorPosition = input.selectionStart;
        const originalValue = input.value;

        let value = originalValue;

        // Заменяем запятые на точки
        value = value.replace(/,/g, '.');

        // Удаляем все символы кроме цифр и точки
        value = value.replace(/[^\d.]/g, '');

        // Удаляем лишние точки (оставляем только первую)
        const parts = value.split('.');
        if (parts.length > 2) {
            value = parts[0] + '.' + parts.slice(1).join('');
        }

        // Ограничиваем количество знаков после запятой (до 1 знака)
        const decimalParts = value.split('.');
        if (decimalParts.length === 2 && decimalParts[1].length > 1) {
            value = decimalParts[0] + '.' + decimalParts[1].substring(0, 1);
        }

        // Убираем ведущие нули (кроме "0.")
        if (value.length > 1 && value[0] === '0' && value[1] !== '.') {
            value = value.substring(1);
        }

        // Если значение не изменилось, не обновляем поле
        if (value === originalValue) {
            return;
        }

        // Обновляем значение
        input.value = value;

        // Вычисляем новую позицию курсора
        const lengthDifference = value.length - originalValue.length;
        let newCursorPosition = cursorPosition + lengthDifference;

        // Корректируем позицию курсора
        if (newCursorPosition < 0) newCursorPosition = 0;
        if (newCursorPosition > value.length) newCursorPosition = value.length;

        // Устанавливаем курсор
        input.setSelectionRange(newCursorPosition, newCursorPosition);

        // Обновляем состояние приложения
        this.updateSetFromInput(input);
    },

    // 🔧 ВАЛИДАЦИЯ ПОЛЯ ВВОДА ЦЕЛЫХ ЧИСЕЛ
    validateIntegerInput(input) {
        const cursorPosition = input.selectionStart;
        const originalValue = input.value;

        let value = originalValue;

        // Удаляем все нецифровые символы
        value = value.replace(/\D/g, '');

        // Убираем ведущие нули (кроме когда это "0")
        if (value === '' || value === '0') {
            value = '0';
        } else {
            value = value.replace(/^0+/, '');
        }

        // Для интенсивности ограничиваем максимальное значение 40
        if (input.classList.contains('intensity-input')) {
            const numValue = parseInt(value) || 0;
            if (numValue > 40) {
                value = '40';
            }
        }

        // Если значение не изменилось, не обновляем поле
        if (value === originalValue) {
            return;
        }

        // Обновляем значение
        input.value = value;

        // Вычисляем новую позицию курсора
        const lengthDifference = value.length - originalValue.length;
        let newCursorPosition = cursorPosition + lengthDifference;

        // Корректируем позицию курсора
        if (newCursorPosition < 0) newCursorPosition = 0;
        if (newCursorPosition > value.length) newCursorPosition = value.length;

        input.setSelectionRange(newCursorPosition, newCursorPosition);

        // Обновляем состояние приложения
        this.updateSetFromInput(input);
    },

    // 🔧 ОБНОВЛЕНИЕ СОСТОЯНИЯ ИЗ INPUT
    updateSetFromInput(input) {
        // Находим родительский контейнер
        const container = input.closest('.set-container, .cardio-container');
        if (!container) return;

        // Находим индекс в родительском контейнере
        const parent = container.parentElement;
        const index = Array.from(parent.children).indexOf(container);

        if (index !== -1) {
            const fieldName = input.classList.contains('weight-input') ? 'weight' :
                input.classList.contains('time-input') ? 'time' :
                    input.classList.contains('intensity-input') ? 'intensity' : 'reps';
            this.updateSet(index, fieldName, input.value);
        }
    },

    // 🔧 ОБРАБОТКА ВСТАВКИ ТЕКСТА
    handlePasteIntoNumberField(e) {
        const input = e.target;
        const pastedText = (e.clipboardData || window.clipboardData).getData('text');

        // Определяем тип поля
        const isWeightField = input.classList.contains('weight-input') ||
            input.classList.contains('body-weight-input');

        let cleanedText;

        if (isWeightField) {
            // Для веса: цифры, точка, запятая
            cleanedText = pastedText.replace(/[^\d,.]/g, '').replace(/,/g, '.');

            // Удаляем лишние точки
            const parts = cleanedText.split('.');
            if (parts.length > 2) {
                cleanedText = parts[0] + '.' + parts.slice(1).join('');
            }

            // Ограничиваем знаки после запятой
            const decimalParts = cleanedText.split('.');
            if (decimalParts.length === 2 && decimalParts[1].length > 1) {
                cleanedText = decimalParts[0] + '.' + decimalParts[1].substring(0, 1);
            }
        } else {
            // Для целых чисел: только цифры
            cleanedText = pastedText.replace(/\D/g, '');

            // Для интенсивности ограничиваем 40
            if (input.classList.contains('intensity-input')) {
                const numValue = parseInt(cleanedText) || 0;
                if (numValue > 40) {
                    cleanedText = '40';
                }
            }
        }

        // Если очищенный текст пустой, ничего не вставляем
        if (!cleanedText) {
            e.preventDefault();
            return;
        }

        // Вставляем очищенный текст
        const start = input.selectionStart;
        const end = input.selectionEnd;
        const currentValue = input.value;

        input.value = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);

        // Устанавливаем курсор после вставленного текста
        const newCursorPosition = start + cleanedText.length;
        input.setSelectionRange(newCursorPosition, newCursorPosition);

        // Обновляем состояние
        setTimeout(() => {
            if (isWeightField) {
                this.validateWeightInput(input);
            } else {
                this.validateIntegerInput(input);
            }
        }, 0);
    },

    // 🔧 ОБРАБОТКА НАЖАТИЙ КЛАВИШ
    handleKeydownOnNumberField(e) {
        const input = e.target;
        const isWeightField = input.classList.contains('weight-input') ||
            input.classList.contains('body-weight-input');

        // Разрешаем стандартные клавиши управления
        if (e.key === 'Backspace' || e.key === 'Delete' || e.key === 'Tab' ||
            e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'Home' || e.key === 'End' ||
            e.key === 'Enter' || e.key === 'Escape') {
            return;
        }

        // Разрешаем Ctrl+C, Ctrl+V, Ctrl+A, Ctrl+X
        if (e.ctrlKey || e.metaKey) {
            return;
        }

        // Разрешаем цифры
        if (/\d/.test(e.key)) {
            return;
        }

        // Для полей веса разрешаем точку и запятую
        if (isWeightField && (e.key === '.' || e.key === ',')) {
            // Если уже есть точка, не разрешаем еще одну
            if (input.value.includes('.')) {
                e.preventDefault();
            }
            return;
        }

        // Все остальные клавиши блокируем
        e.preventDefault();
    },

    // Инициализация обработчиков навигации
    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-button[data-tab]');
        navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const tabName = button.getAttribute('data-tab');
                this.showTab(tabName);
            });
        });

        // Обработчики для кнопок групп мышц
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('group-button')) {
                e.preventDefault();
                const groupName = e.target.textContent;
                this.selectGroup(groupName);
            }
        });
    },

    // 🔄 УПРАВЛЕНИЕ ТЕМАМИ
    initTheme() {
        const savedTheme = localStorage.getItem('theme') || 'dark';
        this.setTheme(savedTheme);
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        this.updateThemeButton(theme);
    },

    updateThemeButton(theme) {
        const icon = document.getElementById('themeIcon');
        const text = document.getElementById('themeText');

        if (theme === 'light') {
            icon.textContent = '☀️';
            text.textContent = 'Светлая тема';
        } else {
            icon.textContent = '🌙';
            text.textContent = 'Темная тема';
        }
    },

    handleAuthStateChange(user) {
        this.state.currentUser = user;

        if (user) {
            // Пользователь вошел
            this.showUserInfo(user);
            this.loadWorkoutsFromFirebase();
            this.loadExerciseStructure(); // 🆕 Загружаем структуру упражнений
            this.showNotification('Добро пожаловать, ' + user.email + '!');
        } else {
            // Пользователь вышел
            this.showAuthForm();
            this.cachedHistory = {};
            this.renderCalendar();
            this.hideUserData();
        }
    },

    showAuthForm() {
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('backupSection').style.display = 'none';
        document.getElementById('analyticsBackupSection').style.display = 'none';

        // Скрываем кнопку выхода в навигации
        document.querySelector('.logout-nav').style.display = 'none';
    },

    showUserInfo(user) {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        document.getElementById('backupSection').style.display = 'block';
        document.getElementById('analyticsBackupSection').style.display = 'block';

        // Показываем кнопку выхода в навигации
        document.querySelector('.logout-nav').style.display = 'block';
    },

    hideUserData() {
        document.getElementById('dateWorkouts').style.display = 'none';
        document.getElementById('motivationBlock').style.display = 'block';
    },

    // 🔐 ФУНКЦИИ ВОССТАНОВЛЕНИЯ ПАРОЛЯ
    showForgotPassword() {
        document.getElementById('forgotPasswordModal').style.display = 'flex';
        document.getElementById('forgotPasswordEmail').value = document.getElementById('authEmail').value || '';
        document.getElementById('forgotPasswordStatus').textContent = '';
    },

    closeForgotPassword() {
        document.getElementById('forgotPasswordModal').style.display = 'none';
    },

    async sendPasswordReset() {
        const email = document.getElementById('forgotPasswordEmail').value;
        const statusElement = document.getElementById('forgotPasswordStatus');

        if (!email) {
            statusElement.textContent = 'Введите ваш email';
            statusElement.className = 'sync-status error';
            return;
        }

        // Проверяем валидность email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            statusElement.textContent = 'Введите корректный email';
            statusElement.className = 'sync-status error';
            return;
        }

        try {
            statusElement.textContent = 'Отправка ссылки...';
            statusElement.className = 'sync-status syncing';

            // Отправляем email для сброса пароля
            await auth.sendPasswordResetEmail(email);

            statusElement.textContent = '✅ Ссылка для сброса пароля отправлена на ваш email!';
            statusElement.className = 'sync-status synced';

            // Закрываем модальное окно через 3 секунды
            setTimeout(() => {
                this.closeForgotPassword();
                this.showNotification('Проверьте вашу почту для сброса пароля');
            }, 3000);

        } catch (error) {
            console.error('Password reset error:', error);

            const errorMessage = this.getPasswordResetErrorMessage(error.code);
            statusElement.textContent = errorMessage;
            statusElement.className = 'sync-status error';
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

    // 🔍 Определяем, был ли выполнен сброс пароля
    handlePasswordReset() {
        // Проверяем URL на наличие параметров сброса пароля
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        const oobCode = urlParams.get('oobCode');

        if (mode === 'resetPassword' && oobCode) {
            this.showNotification('Ссылка для сброса пароля активирована. Проверьте вашу почту.', 'success');

            // Очищаем URL параметры
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    },

    // 🔄 Обновление отображения даты тренировки
    updateWorkoutDateDisplay() {
        const dateDisplay = document.getElementById('selectedDateText');
        if (this.state.selectedWorkoutDate) {
            dateDisplay.textContent = this.state.selectedWorkoutDate;
        } else {
            dateDisplay.textContent = 'Сегодня (' + this.formatDate(new Date()) + ')';
        }
    },

    async signUp() {
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const authStatus = document.getElementById('authStatus');

        if (!email || !password) {
            authStatus.textContent = 'Заполните все поля';
            authStatus.className = 'sync-status error';
            return;
        }

        try {
            authStatus.textContent = 'Регистрация...';
            authStatus.className = 'sync-status syncing';

            const userCredential = await auth.createUserWithEmailAndPassword(email, password);

            // 🔥 Сохраняем пользователя в Firestore
            await this.saveUserToFirestore(userCredential.user);

            this.showNotification('Регистрация успешна!');
            authStatus.textContent = '';

        } catch (error) {
            console.error('Sign up error:', error);
            authStatus.textContent = this.getAuthErrorMessage(error.code);
            authStatus.className = 'sync-status error';
        }
    },

    // 🔥 Сохранение пользователя в Firestore
    async saveUserToFirestore(user) {
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
        const email = document.getElementById('authEmail').value;
        const password = document.getElementById('authPassword').value;
        const authStatus = document.getElementById('authStatus');

        if (!email || !password) {
            authStatus.textContent = 'Заполните все поля';
            authStatus.className = 'sync-status error';
            return;
        }

        try {
            authStatus.textContent = 'Вход...';
            authStatus.className = 'sync-status syncing';

            const userCredential = await auth.signInWithEmailAndPassword(email, password);

            // 🔥 Обновляем lastLogin при входе
            await this.saveUserToFirestore(userCredential.user);

            this.showNotification('Вход выполнен!');
            authStatus.textContent = '';

        } catch (error) {
            console.error('Sign in error:', error);
            authStatus.textContent = this.getAuthErrorMessage(error.code);
            authStatus.className = 'sync-status error';
        }
    },

    async signOut() {
        try {
            if (this.unsubscribeWorkouts) {
                this.unsubscribeWorkouts();
            }
            await auth.signOut();
            this.showNotification('Вы вышли из системы');
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
        if (!this.state.currentUser) return;

        try {
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

                    // Сортируем тренировки по дате
                    this.sortWorkoutsByDate();

                    this.renderCalendar();
                    this.updateAnalytics();

                    this.showNotification('Данные загружены', 'success');
                }, (error) => {
                    console.error('Firestore error:', error);
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

    async saveWorkout() {
        if (!this.state.currentUser) {
            this.showNotification('Сначала войдите в систему', 'error');
            return;
        }

        try {
            // Проверяем заполненность в зависимости от типа упражнения
            let isValid = false;

            if (this.state.selectedGroup === "Кардио") {
                // Для кардио проверяем время и интенсивность
                const cardioData = this.state.sets[0];
                isValid = cardioData.time && cardioData.intensity;
                if (!isValid) {
                    this.showNotification('Заполните время и уровень сложности!', 'error');
                    return;
                }
            } else {
                // Для силовых проверяем вес и повторения
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
                userId: this.state.currentUser.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                bodyWeight: this.state.bodyWeight || null,
                variations: this.state.variations || []
            };

            this.showNotification('Сохранение в облако...', 'info');

            if (this.state.editingWorkout) {
                // Обновляем существующую тренировку
                await db.collection('workouts').doc(this.state.editingWorkout.id).update(workout);
                this.showNotification('Тренировка "' + this.state.selectedExercise + '" обновлена!');
            } else {
                // Создаем новую тренировку
                await db.collection('workouts').add(workout);
                this.showNotification('Тренировка "' + this.state.selectedExercise + '" сохранена в облако!');
            }

            this.resetWorkoutState();
            await this.updateAnalytics();

            setTimeout(() => {
                this.hideNotification();
                this.showTab('home');
            }, 1000);

        } catch (error) {
            console.error('Save workout error:', error);
            this.showNotification('Ошибка сохранения в облако', 'error');
        }
    },

    resetWorkoutState() {
        this.state.selectedGroup = null;
        this.state.selectedExercise = null;
        this.state.sets = [{ weight: '', reps: '', completed: false }];
        this.state.editingWorkout = null;
        this.state.bodyWeight = '';
        this.state.variations = [];

        document.querySelectorAll('.group-button, .exercise-button').forEach(btn => {
            btn.classList.remove('selected');
        });

        document.getElementById('exercisesSection').style.display = 'none';
        document.getElementById('setsSection').style.display = 'none';
        document.getElementById('bodyWeightSection').style.display = 'none';
    },

    renderCalendar() {
        const calendarGrid = document.getElementById('calendarGrid');
        if (!calendarGrid) return;

        const monthNames = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
        document.getElementById('currentMonth').textContent = monthNames[this.state.currentMonth] + ' ' + this.state.currentYear;

        const firstDay = new Date(this.state.currentYear, this.state.currentMonth, 1);
        const startDate = new Date(firstDay);
        const firstDayOfWeek = firstDay.getDay() || 7;
        startDate.setDate(startDate.getDate() - (firstDayOfWeek - 1));

        calendarGrid.innerHTML = '';

        ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            calendarGrid.appendChild(dayElement);
        });

        const today = new Date();
        const workoutHistory = this.cachedHistory;

        for (let i = 0; i < 42; i++) {
            const date = new Date(startDate);
            date.setDate(startDate.getDate() + i);

            const dateElement = document.createElement('div');
            dateElement.className = 'calendar-date';
            dateElement.dataset.date = this.formatDate(date);

            const dateString = this.formatDate(date);
            const hasWorkout = workoutHistory[dateString]?.length > 0;
            const isToday = date.toDateString() === today.toDateString();
            const isCurrentMonth = date.getMonth() === this.state.currentMonth;

            if (!isCurrentMonth) dateElement.classList.add('other-month');
            if (hasWorkout) dateElement.classList.add('has-workout');
            if (isToday) dateElement.classList.add('today');

            dateElement.textContent = date.getDate();
            dateElement.onclick = () => this.showWorkoutHistory(dateString);
            calendarGrid.appendChild(dateElement);
        }
    },

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

    showWorkoutHistory(dateString) {
        this.state.selectedWorkoutDate = dateString;
        this.updateWorkoutDateDisplay();

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

        dateWorkoutsElement.style.display = 'block';
        motivationBlock.style.display = 'none';

        // 🔥 ПРОВЕРКА НА ПУСТОЙ МАССИВ ПОСЛЕ УДАЛЕНИЯ
        if (!workouts || workouts.length === 0) {
            dateWorkoutsElement.innerHTML =
                '<div class="section-title">На ' + dateString + ' тренировок нет</div>' +
                '<button class="add-button" onclick="app.addWorkoutToDate(\'' + dateString + '\')">' +
                '+ Добавить тренировку на эту дату' +
                '</button>';
            return;
        }

        let historyHTML = '<div class="section-title">Тренировки за ' + dateString + ':</div>' +
            '<button class="add-button" onclick="app.addWorkoutToDate(\'' + dateString + '\')" style="margin-bottom: 15px;">' +
            '+ Добавить тренировку на эту дату' +
            '</button>';
        workouts.forEach((workout, index) => {
            let detailsText = '';
            if (workout.muscleGroup === "Кардио") {
                const cardioData = workout.sets[0];
                detailsText = 'Время: ' + cardioData.time + ' мин, Сложность: ' + cardioData.intensity + '/40';
            } else {
                detailsText = 'Подходов: ' + workout.sets.length;
            }

            // Добавляем информацию о весе тела, если она есть
            if (workout.bodyWeight) {
                detailsText += ', Вес тела: ' + workout.bodyWeight + ' кг';
            }

            // Добавляем информацию о вариациях, если они есть
            if (workout.variations && workout.variations.length > 0) {
                detailsText += ', Вариации: ' + workout.variations.join(', ');
            }

            historyHTML +=
                '<div class="history-item">' +
                '<div class="history-exercise" onclick="app.viewWorkoutDetails(\'' + dateString + '\', ' + index + ')">' +
                workout.exercise +
                '</div>' +
                '<div class="history-details">' +
                detailsText +
                '</div>' +
                '<div class="action-buttons">' +
                '<button class="edit-button" onclick="app.editWorkout(\'' + dateString + '\', ' + index + ')">✏️ Редактировать</button>' +
                '<button class="delete-button" onclick="app.deleteWorkout(\'' + dateString + '\', ' + index + ')">🗑️ Удалить</button>' +
                '</div>' +
                '</div>';
        });
        dateWorkoutsElement.innerHTML = historyHTML;
    },

    viewWorkoutDetails(dateString, workoutIndex) {
        const workoutHistory = this.cachedHistory;
        if (!workoutHistory[dateString]?.[workoutIndex]) {
            this.showNotification('Тренировка не найдена', 'error');
            return;
        }

        const workout = workoutHistory[dateString][workoutIndex];
        document.getElementById('modalExerciseName').textContent = workout.exercise;

        let detailsHTML = '<div class="workout-details">';

        // Добавляем информацию о весе тела, если она есть
        if (workout.bodyWeight) {
            detailsHTML +=
                '<div class="workout-set">' +
                '<div>Вес тела</div>' +
                '<div>' + workout.bodyWeight + ' кг</div>' +
                '</div>';
        }

        // Добавляем информацию о вариациях, если они есть
        if (workout.variations && workout.variations.length > 0) {
            detailsHTML +=
                '<div class="workout-set">' +
                '<div>Варианты выполнения</div>' +
                '<div>' + workout.variations.join(', ') + '</div>' +
                '</div>';
        }

        if (workout.muscleGroup === "Кардио") {
            // Отображение для кардио
            const cardioData = workout.sets[0];
            detailsHTML +=
                '<div class="workout-set">' +
                '<div>Время</div>' +
                '<div>' + cardioData.time + ' минут</div>' +
                '</div>' +
                '<div class="workout-set">' +
                '<div>Уровень сложности</div>' +
                '<div>' + cardioData.intensity + '/40</div>' +
                '</div>';
        } else {
            // Отображение для силовых
            workout.sets.forEach((set, index) => {
                if (set.weight || set.reps) {
                    detailsHTML +=
                        '<div class="workout-set">' +
                        '<div>Подход ' + (index + 1) + '</div>' +
                        '<div>' + set.weight + ' кг × ' + set.reps + ' повторений</div>' +
                        '</div>';
                }
            });
        }
        detailsHTML += '</div>';

        document.getElementById('workoutDetails').innerHTML = detailsHTML;
        document.getElementById('workoutModal').style.display = 'flex';
    },

    closeWorkoutModal() {
        document.getElementById('workoutModal').style.display = 'none';
    },

    addWorkoutToDate(dateString) {
        this.resetWorkoutState();
        this.state.selectedWorkoutDate = dateString;
        this.updateWorkoutDateDisplay();
        this.showTab('workout');
        this.showNotification('Добавляем тренировку на ' + dateString);
    },

    async editWorkout(dateString, workoutIndex) {
        const workout = this.cachedHistory[dateString][workoutIndex];
        this.showTab('workout');

        this.state.selectedGroup = workout.muscleGroup;
        this.state.selectedExercise = workout.exercise;
        this.state.sets = workout.sets.map(set => ({
            weight: set.weight || '',
            reps: set.reps || '',
            time: set.time || '',
            intensity: set.intensity || '',
            completed: set.completed || false
        }));
        this.state.editingWorkout = { date: dateString, index: workoutIndex, id: workout.id };
        this.state.selectedWorkoutDate = dateString;
        this.state.bodyWeight = workout.bodyWeight || '';
        this.state.variations = workout.variations || [];
        this.updateWorkoutDateDisplay();

        document.getElementById('exercisesSection').style.display = 'block';
        document.getElementById('setsSection').style.display = 'block';
        document.getElementById('bodyWeightSection').style.display = 'block';

        // Устанавливаем значение веса тела в поле ввода
        const bodyWeightInput = document.getElementById('bodyWeightInput');
        bodyWeightInput.value = this.state.bodyWeight;

        // Добавляем класс для валидации веса тела
        bodyWeightInput.classList.add('body-weight-input');

        document.querySelectorAll('.group-button').forEach(btn => {
            btn.classList.remove('selected');
            if (btn.textContent === this.state.selectedGroup) {
                btn.classList.add('selected');
            }
        });

        this.renderExercises();

        setTimeout(() => {
            document.querySelectorAll('.exercise-button').forEach(btn => {
                btn.classList.remove('selected');
                if (btn.textContent === this.state.selectedExercise) {
                    btn.classList.add('selected');
                }
            });

            this.renderSets();
            document.querySelector('.save-button').textContent = 'Обновить тренировку';
            this.showNotification('Редактируем тренировку "' + this.state.selectedExercise + '"');

            document.getElementById('setsSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 100);
    },

    // 🔥 ИСПРАВЛЕННЫЙ МЕТОД УДАЛЕНИЯ ТРЕНИРОВКИ
    async deleteWorkout(dateString, workoutIndex) {
        if (!this.state.currentUser) return;

        if (!confirm('Удалить эту тренировку?')) return;

        try {
            const workout = this.cachedHistory[dateString][workoutIndex];
            if (workout.id) {
                await db.collection('workouts').doc(workout.id).delete();

                // 🔥 ОБНОВЛЯЕМ ЛОКАЛЬНЫЙ КЭШ
                this.removeWorkoutFromCache(dateString, workoutIndex);

                // 🔥 ОБНОВЛЯЕМ КАЛЕНДАРЬ (чтобы убрать маркер тренировки)
                this.renderCalendar();

                // 🔥 ПЕРЕРИСОВЫВАЕМ ИСТОРИЮ ТРЕНИРОВОК
                this.showWorkoutHistory(dateString);

                this.showNotification('Тренировка удалена!');
            }
        } catch (error) {
            console.error('Delete workout error:', error);
            this.showNotification('Не удалось удалить тренировку', 'error');
        }
    },

    // 🔥 НОВЫЙ МЕТОД ДЛЯ УДАЛЕНИЯ ИЗ ЛОКАЛЬНОГО КЭША
    removeWorkoutFromCache(dateString, workoutIndex) {
        if (this.cachedHistory[dateString] && this.cachedHistory[dateString][workoutIndex]) {
            // Удаляем тренировку из массива
            this.cachedHistory[dateString].splice(workoutIndex, 1);

            // Если массив пустой, удаляем дату полностью
            if (this.cachedHistory[dateString].length === 0) {
                delete this.cachedHistory[dateString];
            }

            console.log('Локальный кэш обновлен после удаления');
        }
    },

    async updateAnalytics() {
        const allWorkouts = this.getAllWorkouts();

        document.getElementById('totalWorkouts').textContent = allWorkouts.length;

        const thisMonth = new Date().getMonth();
        const monthWorkouts = allWorkouts.filter(workout => {
            const [day, month, year] = workout.date.split('.');
            return parseInt(month) - 1 === thisMonth;
        });
        document.getElementById('monthWorkouts').textContent = monthWorkouts.length;

        const totalSets = allWorkouts.reduce((sum, workout) => sum + workout.sets.length, 0);
        document.getElementById('totalSets').textContent = totalSets;

        const allWeights = [];
        allWorkouts.forEach(workout => {
            workout.sets.forEach(set => {
                if (set.weight && parseFloat(set.weight) > 0) {
                    allWeights.push(parseFloat(set.weight));
                }
            });
        });
        const avgWeight = allWeights.length > 0 ? (allWeights.reduce((a, b) => a + b, 0) / allWeights.length).toFixed(1) : '0';
        document.getElementById('avgWeight').textContent = avgWeight;

        this.updateCharts(allWorkouts);
    },

    updateCharts(allWorkouts) {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js не доступен, графики не будут отображены');
            return;
        }

        const muscleGroups = {};
        allWorkouts.forEach(workout => {
            muscleGroups[workout.muscleGroup] = (muscleGroups[workout.muscleGroup] || 0) + 1;
        });

        const ctx = document.getElementById('muscleGroupChart');
        if (!ctx) return;

        try {
            const ctx2d = ctx.getContext('2d');
            if (this.muscleGroupChart) this.muscleGroupChart.destroy();

            this.muscleGroupChart = new Chart(ctx2d, {
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
                    plugins: { legend: { position: 'bottom' } }
                }
            });

            const progressCtx = document.getElementById('progressChart');
            if (!progressCtx) return;

            const progressCtx2d = progressCtx.getContext('2d');
            if (this.progressChart) this.progressChart.destroy();

            const lastWorkouts = allWorkouts.slice(-10).reverse();
            this.progressChart = new Chart(progressCtx2d, {
                type: 'line',
                data: {
                    labels: lastWorkouts.map((_, i) => 'Тренировка ' + (i + 1)),
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
                    scales: { y: { beginAtZero: true } }
                }
            });
        } catch (error) {
            console.error('Ошибка создания графиков:', error);
        }
    },

    getAllWorkouts() {
        const history = this.cachedHistory || {};
        const allWorkouts = [];
        Object.values(history).forEach(workouts => {
            allWorkouts.push(...workouts);
        });
        return allWorkouts.sort((a, b) => {
            const dateA = new Date(a.date.split('.').reverse().join('-'));
            const dateB = new Date(b.date.split('.').reverse().join('-'));
            return dateA - dateB;
        });
    },

    exportData() {
        try {
            const data = this.cachedHistory;
            if (!data || Object.keys(data).length === 0) {
                this.showNotification('Нет данных для экспорта', 'error');
                return;
            }

            const prettyData = JSON.stringify(data, null, 2);
            const blob = new Blob([prettyData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = url;
            a.download = 'sport-tracker-backup-' + this.formatDate(new Date()) + '.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('Данные успешно экспортированы!');
        } catch (error) {
            this.showNotification('Ошибка при экспорте данных', 'error');
            console.error('Export error:', error);
        }
    },

    importData(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);

                if (typeof data !== 'object' || data === null) {
                    throw new Error('Неверный формат файла');
                }

                if (!confirm('Внимание! Это перезапишет все текущие данные. Продолжить?')) {
                    event.target.value = '';
                    return;
                }

                // Для импорта нужно загрузить данные в Firebase
                this.importDataToFirebase(data);
                event.target.value = '';
            } catch (error) {
                this.showNotification('Ошибка: неверный формат файла', 'error');
                console.error('Import error:', error);
            }
        };

        reader.onerror = () => {
            this.showNotification('Ошибка чтения файла', 'error');
        };

        reader.readAsText(file);
    },

    async importDataToFirebase(data) {
        if (!this.state.currentUser) {
            this.showNotification('Сначала войдите в систему', 'error');
            return;
        }

        try {
            this.showNotification('Импорт данных в облако...', 'info');

            // Удаляем старые данные
            const snapshot = await db.collection('workouts')
                .where('userId', '==', this.state.currentUser.uid)
                .get();

            const batch = db.batch();
            snapshot.forEach(doc => {
                batch.delete(doc.ref);
            });
            await batch.commit();

            // Добавляем новые данные
            for (const [date, workouts] of Object.entries(data)) {
                for (const workout of workouts) {
                    await db.collection('workouts').add({
                        ...workout,
                        userId: this.state.currentUser.uid,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                }
            }

            this.showNotification('Данные успешно импортированы в облако!');
        } catch (error) {
            console.error('Import to Firebase error:', error);
            this.showNotification('Ошибка импорта в облако', 'error');
        }
    },

    renderGroups() {
        const groupsContainer = document.getElementById('groupsContainer');
        groupsContainer.innerHTML = '';

        Object.keys(this.exercisesDatabase).sort().forEach(group => {
            const button = document.createElement('button');
            button.className = 'group-button';
            button.textContent = group;
            button.onclick = () => this.selectGroup(group);
            groupsContainer.appendChild(button);
        });
    },

    selectGroup(group) {
        console.log('Выбрана группа:', group);
        this.state.selectedGroup = group;
        this.state.selectedExercise = null;

        // Инициализируем соответствующий тип данных
        if (group === "Кардио") {
            this.state.sets = [{ time: '', intensity: '', completed: false }];
        } else {
            this.state.sets = [{ weight: '', reps: '', completed: false }];
        }

        document.querySelectorAll('.group-button').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.group-button').forEach(btn => {
            if (btn.textContent === group) {
                btn.classList.add('selected');
            }
        });

        this.renderExercises();
        document.getElementById('exercisesSection').style.display = 'block';
        document.getElementById('setsSection').style.display = 'none';
        document.getElementById('bodyWeightSection').style.display = 'block';

        setTimeout(() => {
            document.getElementById('exercisesSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    },

    // 🆕 ОБНОВЛЕННЫЙ RENDER_EXERCISES С ВИЗУАЛЬНЫМ WORKFLOW
    renderExercises() {
        const exercisesContainer = document.getElementById('exercisesContainer');
        const exercisesTitle = document.getElementById('exercisesTitle');

        if (!this.state.selectedGroup) return;

        const group = this.state.selectedGroup;
        const activeExercises = this.exercisesDatabase[group]?.active || [];
        const archivedExercises = this.exercisesDatabase[group]?.archived || [];
        const showArchived = this.state.showArchived[group];
        const searchQuery = this.state.searchQuery || '';

        exercisesTitle.textContent = '2. Выберите упражнение для ' + group + ':';

        let html =
            '<div class="exercises-stats" style="margin-bottom: 15px; font-size: 14px; color: var(--text-secondary);">' +
            '💪 ' + group + ' (' + activeExercises.length + '/' + (activeExercises.length + archivedExercises.length) + ')' +
            '</div>';

        // Активные упражнения
        activeExercises.forEach(exercise => {
            html +=
                '<div class="exercise-item">' +
                '<button class="exercise-button selected" ' +
                'onclick="app.selectExercise(\'' + exercise + '\')" ' +
                'style="flex: 1; margin-right: 10px;">' +
                '✅ ' + exercise +
                '</button>' +
                '<button class="archive-btn" ' +
                'onclick="app.toggleExerciseStatus(\'' + group + '\', \'' + exercise + '\', true)">' +
                '📁' +
                '</button>' +
                '</div>';
        });

        // Секция архива
        if (archivedExercises.length > 0) {
            const filteredArchived = searchQuery ?
                this.filterExercises(group, searchQuery) : archivedExercises;

            html +=
                '<div class="archived-section">' +
                '<div class="archived-header">' +
                '<button class="toggle-archive-btn" ' +
                'onclick="app.toggleArchivedView(\'' + group + '\')">' +
                '👁️ ' + (showArchived ? 'Скрыть' : 'Показать') + ' ' + archivedExercises.length + ' скрытых' +
                '</button>' +
                '</div>';

            if (showArchived) {
                // Поле поиска в раскрытом архиве
                html +=
                    '<div style="margin-bottom: 15px;">' +
                    '<input type="text" ' +
                    'class="search-input" ' +
                    'placeholder="🔍 Поиск в архиве..." ' +
                    'value="' + searchQuery + '"' +
                    'oninput="app.handleArchiveSearch(\'' + group + '\', this.value)">' +
                    '</div>';

                // Архивные упражнения
                if (filteredArchived.length > 0) {
                    filteredArchived.forEach(exercise => {
                        html +=
                            '<div class="exercise-item">' +
                            '<button class="exercise-button" ' +
                            'onclick="app.selectExercise(\'' + exercise + '\')" ' +
                            'style="flex: 1; margin-right: 10px; background: var(--bg-card); opacity: 0.7;">' +
                            '❌ ' + exercise +
                            '</button>' +
                            '<button class="unarchive-btn" ' +
                            'onclick="app.toggleExerciseStatus(\'' + group + '\', \'' + exercise + '\', false)">' +
                            '📂' +
                            '</button>' +
                            '</div>';
                    });
                } else {
                    html += '<div style="text-align: center; color: var(--text-secondary); padding: 20px;">Ничего не найдено</div>';
                }
            }

            html += '</div>';
        }

        // Кнопка добавления своего упражнения
        /* html +=
             '<button class="add-custom-exercise-btn" ' +
             'onclick="app.showAddCustomExerciseModal(\'' + group + '\')">' +
             '➕ Добавить свое упражнение' +
             '</button>';*/

        exercisesContainer.innerHTML = html;
    },

    selectExercise(exercise) {
        console.log('Выбрано упражнение:', exercise);
        this.state.selectedExercise = exercise;

        document.querySelectorAll('.exercise-button').forEach(btn => btn.classList.remove('selected'));
        document.querySelectorAll('.exercise-button').forEach(btn => {
            if (btn.textContent === exercise) {
                btn.classList.add('selected');
            }
        });

        this.renderSets();
        document.getElementById('setsSection').style.display = 'block';

        setTimeout(() => {
            document.getElementById('setsSection').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }, 300);
    },

    renderSets() {
        const setsContainer = document.getElementById('setsContainer');
        const selectedExerciseName = document.getElementById('selectedExerciseName');

        selectedExerciseName.textContent = this.state.selectedExercise;
        setsContainer.innerHTML = '';

        // Добавляем секцию вариаций упражнения
        const variations = this.getExerciseVariations(this.state.selectedExercise);
        if (variations.length > 0) {
            const variationsSection = document.createElement('div');
            variationsSection.className = 'variations-section';
            variationsSection.style.marginBottom = '20px';
            variationsSection.innerHTML =
                '<div class="section-title">Варианты выполнения:</div>' +
                '<div class="variations-container">' +
                variations.map(variation =>
                    '<label class="variation-label ' + (this.state.variations.includes(variation) ? 'selected' : '') + '">' +
                    '<input type="checkbox" class="variation-checkbox" value="' + variation + '" ' +
                    (this.state.variations.includes(variation) ? 'checked' : '') +
                    ' onchange="app.toggleVariation(\'' + variation + '\')">' +
                    variation +
                    '</label>'
                ).join('') +
                '</div>';
            setsContainer.appendChild(variationsSection);
        }

        if (this.state.selectedGroup === "Кардио") {
            // Отображение для кардио
            this.state.sets.forEach((set, index) => {
                const cardioElement = document.createElement('div');
                cardioElement.className = 'cardio-container';
                cardioElement.innerHTML =
                    '<div style="min-width: 80px;">Кардио</div>' +
                    '<div class="cardio-inputs">' +
                    '<div style="flex: 1;">' +
                    '<div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Время (мин)</div>' +
                    '<input type="number" class="time-input" placeholder="0" value="' + set.time + '"' +
                    ' oninput="this.dispatchEvent(new Event(\'input\', {bubbles: true}))" min="0" step="1">' +
                    '</div>' +
                    '<div style="flex: 1;">' +
                    '<div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Сложность (1-40)</div>' +
                    '<input type="number" class="intensity-input" placeholder="0" value="' + set.intensity + '"' +
                    ' oninput="this.dispatchEvent(new Event(\'input\', {bubbles: true}))" min="1" max="40">' +
                    '</div>' +
                    '</div>';
                setsContainer.appendChild(cardioElement);
            });
        } else {
            // Отображение для силовых
            this.state.sets.forEach((set, index) => {
                const setElement = document.createElement('div');
                setElement.className = 'set-container';
                setElement.innerHTML =
                    '<div style="min-width: 80px;">Подход ' + (index + 1) + '</div>' +
                    '<div class="set-inputs">' +
                    '<div style="flex: 1;">' +
                    '<div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Вес (кг)</div>' +
                    '<input type="number" class="weight-input" placeholder="0" value="' + set.weight + '"' +
                    ' oninput="this.dispatchEvent(new Event(\'input\', {bubbles: true}))" min="0" step="0.5">' +
                    '</div>' +
                    '<div style="flex: 1;">' +
                    '<div style="font-size: 12px; color: var(--text-secondary); margin-bottom: 4px;">Повторения</div>' +
                    '<input type="number" class="reps-input" placeholder="0" value="' + set.reps + '"' +
                    ' oninput="this.dispatchEvent(new Event(\'input\', {bubbles: true}))" min="0">' +
                    '</div>' +
                    '</div>' +
                    (this.state.sets.length > 1 ?
                        '<button onclick="app.deleteSet(' + index + ')" style="background: #ff0066; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer;">' +
                        '🗑️' +
                        '</button>' : '');
                setsContainer.appendChild(setElement);
            });
        }

        // Инициализируем валидацию для новых полей
        setTimeout(() => {
            const newInputs = setsContainer.querySelectorAll('input[type="number"]');
            newInputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    if (e.target.classList.contains('weight-input')) {
                        this.validateWeightInput(e.target);
                    } else if (e.target.classList.contains('reps-input') ||
                        e.target.classList.contains('time-input') ||
                        e.target.classList.contains('intensity-input')) {
                        this.validateIntegerInput(e.target);
                    }
                });

                input.addEventListener('paste', (e) => {
                    e.preventDefault();
                    this.handlePasteIntoNumberField(e);
                });

                input.addEventListener('keydown', (e) => {
                    this.handleKeydownOnNumberField(e);
                });
            });
        }, 0);
    },

    updateSet(index, field, value) {
        this.state.sets[index][field] = value;
    },

    addSet() {
        if (this.state.selectedGroup === "Кардио") {
            // Для кардио только один блок
            this.showNotification('Для кардио доступен только один блок данных', 'info');
            return;
        }
        this.state.sets.push({ weight: '', reps: '', completed: false });
        this.renderSets();

        setTimeout(() => {
            const setsContainer = document.getElementById('setsContainer');
            const lastSet = setsContainer.lastElementChild;
            if (lastSet) {
                lastSet.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });
            }
        }, 100);
    },

    deleteSet(index) {
        if (this.state.sets.length > 1) {
            this.state.sets.splice(index, 1);
            this.renderSets();
        }
    },

    showNotification(message, type = 'info') {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.className = 'notification ' + (type === 'error' ? 'error' : '');
        notification.classList.add('show');

        if (type !== 'info') {
            setTimeout(() => this.hideNotification(), 3000);
        }
    },

    hideNotification() {
        const notification = document.getElementById('notification');
        notification.classList.remove('show');
    },

    async showTab(tabName) {
        document.querySelectorAll('.content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.nav-button').forEach(btn => btn.classList.remove('active'));

        document.getElementById(tabName).classList.add('active');

        document.querySelectorAll('.nav-button').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            }
        });

        if (tabName === 'analytics') {
            await this.updateAnalytics();
        } else if (tabName === 'home') {
            this.renderCalendar();
            document.getElementById('dateWorkouts').style.display = 'none';
            document.getElementById('motivationBlock').style.display = 'block';
        } else if (tabName === 'workout') {
            this.updateWorkoutDateDisplay();
            // Обновляем значение веса тела при переключении на вкладку тренировки
            const bodyWeightInput = document.getElementById('bodyWeightInput');
            this.state.bodyWeight = bodyWeightInput.value || '';

            // Добавляем класс для валидации веса тела, если его нет
            if (!bodyWeightInput.classList.contains('body-weight-input')) {
                bodyWeightInput.classList.add('body-weight-input');
            }
        }
    },

    formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return day + '.' + month + '.' + year;
    }
};

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// Обработчик изменения веса тела
document.getElementById('bodyWeightInput').addEventListener('input', function () {
    app.state.bodyWeight = this.value;
});
/* */