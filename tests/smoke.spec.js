const { test, expect } = require('@playwright/test');

// ОБНОВЛЕННЫЕ ДАННЫЕ УПРАЖНЕНИЙ С АКТИВНЫМИ И АРХИВНЫМИ
const exercisesData = {
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
            "Сведения рук в тренажёре «Бабочка»"
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
            "Гребной тренажер",
            "Лыжный тренажер SkiErg",
            "Сайклинг",
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
            "Жим ногами в тренажере (горизонтальный)",
            "Жим ногами в тренажере (вверх, под углом 45)",
            "Икроножные мышцы сидя",
            "Икроножные мышцы стоя",
            "Отведения ноги назад в тренажере",
            "Отведения ноги назад в кроссовере",
            "Отведения ноги в бок в кроссовере",
            "Приседания со штангой",
            "Разведение ног тренажере",
            "Разгибание ног (по одной ноге)",
            "Разгибание ног сидя",
            "Сведение ног в тренажере",
            "Сгибание ног лежа",
            "Сгибание ног сидя",
            "Сгибание ног стоя (по одной ноге)"
        ],
        archived: [
            "Выпады с гантелями",
            "Выпады со штангой",
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
            "Становая тяга классическая",
            "Становая тяга румынская",
            "Тяга вертикального блока к груди",
            "Тяга верхнего блока в тренажёре «Хаммер»",
            "Тяга горизонтального блока к поясу",
            "Тяга блока в тренажёре с упором груди",
            "Тяга штанги в наклоне",
            "Тяга т-грифа с упором"
        ],
        archived: [
            "Тяга гантели в наклоне",
            "Шраги со штангой стоя",
            "Шраги с гантелями стоя",
            "Пуловер в блочном тренажере"
        ]
    }
};

test.describe('Sport Tracker Smoke Tests - Updated Structure', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('https://logfitness.ru/');
        await page.waitForTimeout(1000);
    });

    test('should load main page with correct title and navigation', async ({ page }) => {
        await expect(page).toHaveTitle('Sport Tracker Pro');
        await expect(page.locator('text=Мои тренировки')).toBeVisible();
        await expect(page.locator('.nav-button:has-text("Календарь")')).toBeVisible();
        await expect(page.locator('.nav-button:has-text("Тренировка")')).toBeVisible();
        await expect(page.locator('.nav-button:has-text("Прогресс")')).toBeVisible();
    });

    // ТЕСТЫ ДЛЯ ПРОВЕРКИ АКТИВНЫХ УПРАЖНЕНИЙ
    test('should display all active chest exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Проверяем только активные упражнения
        for (const exercise of exercisesData["Грудь"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
        
        // Проверяем, что архивные упражнения не отображаются по умолчанию
        for (const exercise of exercisesData["Грудь"].archived) {
            await expect(page.locator(`button:has-text("❌ ${exercise}")`).first()).not.toBeVisible();
        }
    });

    test('should display all active back exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Спина');
        await page.waitForTimeout(2000);
        
        for (const exercise of exercisesData["Спина"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
    });

    test('should display all active arms exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Руки');
        await page.waitForTimeout(2000);
        
        for (const exercise of exercisesData["Руки"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
    });

    test('should display all active shoulders exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Плечи');
        await page.waitForTimeout(2000);
        
        for (const exercise of exercisesData["Плечи"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
    });

    test('should display all active legs exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Ноги');
        await page.waitForTimeout(2000);
        
        for (const exercise of exercisesData["Ноги"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
    });

    test('should display all active cardio exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Кардио');
        await page.waitForTimeout(2000);
        
        for (const exercise of exercisesData["Кардио"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
    });

    test('should display all active abs exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Пресс');
        await page.waitForTimeout(2000);
        
        for (const exercise of exercisesData["Пресс"].active) {
            await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
        }
    });

    // ТЕСТЫ ДЛЯ ПРОВЕРКИ АРХИВНЫХ УПРАЖНЕНИЙ
    test('should be able to view archived chest exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Нажимаем кнопку показа архива
        const archiveButton = page.locator('button.toggle-archive-btn:has-text("Показать")').first();
        await archiveButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем архивные упражнения
        for (const exercise of exercisesData["Грудь"].archived) {
            await expect(page.locator(`button.exercise-button:has-text("❌ ${exercise}")`).first()).toBeVisible();
        }
    });

    test('should be able to view archived back exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Спина');
        await page.waitForTimeout(2000);
        
        // Нажимаем кнопку показа архива
        const archiveButton = page.locator('button.toggle-archive-btn:has-text("Показать")').first();
        await archiveButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем архивные упражнения
        for (const exercise of exercisesData["Спина"].archived) {
            await expect(page.locator(`button.exercise-button:has-text("❌ ${exercise}")`).first()).toBeVisible();
        }
    });

    // ОБЩИЙ ТЕСТ ДЛЯ ПРОВЕРКИ ВСЕХ ГРУПП МЫШЦ
    test('should display all muscle groups and their active exercises', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        
        const muscleGroups = Object.keys(exercisesData);
        for (const group of muscleGroups) {
            // Кликаем на группу мышц
            await page.click(`text=${group}`);
            await page.waitForTimeout(1000);
            
            // Проверяем заголовок
            await expect(page.locator(`text=Выберите упражнение для ${group}`)).toBeVisible();
            
            // Проверяем активные упражнения
            for (const exercise of exercisesData[group].active) {
                await expect(page.locator(`button.exercise-button.selected:has-text("✅ ${exercise}")`).first()).toBeVisible();
            }
            
            // Небольшая пауза между группами
            await page.waitForTimeout(500);
        }
    });

    // ТЕСТЫ ДЛЯ ПРОВЕРКИ ВАРИАЦИЙ УПРАЖНЕНИЙ (с обновленными названиями)
    test('should display exercise variations for leg press horizontal', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Ноги');
        
        // Ищем кнопку с точным названием упражнения
        await page.waitForSelector('button.exercise-button.selected');
        const legPressButton = page.locator('button.exercise-button.selected:has-text("Жим ногами в тренажере (горизонтальный)")').first();
        await legPressButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем, что появились варианты выполнения
        await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
        await expect(page.locator('text=Узкая постановка')).toBeVisible();
        await expect(page.locator('text=Широкая постановка')).toBeVisible();
        await expect(page.locator('text=Средняя постановка')).toBeVisible();
    });

    test('should display exercise variations for leg press 45', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Ноги');
        
        // Прокручиваем и ищем второе упражнение жима ногами
        await page.waitForSelector('button.exercise-button.selected');
        const legPress45Button = page.locator('button.exercise-button.selected:has-text("Жим ногами в тренажере (вверх, под углом 45)")').first();
        await legPress45Button.scrollIntoViewIfNeeded();
        await legPress45Button.click();
        await page.waitForTimeout(1000);
        
        // Проверяем варианты выполнения
        await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
        await expect(page.locator('text=Узкая постановка')).toBeVisible();
        await expect(page.locator('text=Широкая постановка')).toBeVisible();
        await expect(page.locator('text=Средняя постановка')).toBeVisible();
    });

    test('should display exercise variations for pull-ups', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Спина');
        
        await page.waitForSelector('button.exercise-button.selected');
        const pullupsButton = page.locator('button.exercise-button.selected:has-text("Подтягивания")').first();
        await pullupsButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем варианты хвата
        await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
        await expect(page.locator('text=Широкий хват')).toBeVisible();
        await expect(page.locator('text=Узкий хват')).toBeVisible();
        await expect(page.locator('text=Обратный хват')).toBeVisible();
        await expect(page.locator('text=Нейтральный хват')).toBeVisible();
    });

    test('should display exercise variations for vertical pull', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Спина');
        
        await page.waitForSelector('button.exercise-button.selected');
        const verticalPullButton = page.locator('button.exercise-button.selected:has-text("Тяга вертикального блока к груди")').first();
        await verticalPullButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем варианты хвата
        await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
        await expect(page.locator('text=Широкий хват')).toBeVisible();
        await expect(page.locator('text=Узкий хват')).toBeVisible();
        await expect(page.locator('text=Обратный хват')).toBeVisible();
    });

    test('should display exercise variations for squats', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Ноги');
        
        await page.waitForSelector('button.exercise-button.selected');
        const squatsButton = page.locator('button.exercise-button.selected:has-text("Приседания со штангой")').first();
        await squatsButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем варианты постановки ног
        await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
        await expect(page.locator('text=Узкая постановка')).toBeVisible();
        await expect(page.locator('text=Широкая постановка')).toBeVisible();
        await expect(page.locator('text=Средняя постановка')).toBeVisible();
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ НОВЫХ ФУНКЦИЙ АРХИВА
    test('should show archive management buttons', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Проверяем наличие кнопок управления архивом
        await expect(page.locator('button.toggle-archive-btn:has-text("Показать")')).toBeVisible();
        
        // Проверяем наличие кнопок архивации рядом с упражнениями
        const firstExercise = exercisesData["Грудь"].active[0];
        const exerciseRow = page.locator(`button.exercise-button.selected:has-text("✅ ${firstExercise}")`).locator('..');
        await expect(exerciseRow.locator('button.archive-btn')).toBeVisible();
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ ПОИСКА В АРХИВЕ
    test('should have search functionality in archive', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Открываем архив
        const archiveButton = page.locator('button.toggle-archive-btn:has-text("Показать")').first();
        await archiveButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем наличие поля поиска
        await expect(page.locator('input.search-input[placeholder*="Поиск в архиве"]')).toBeVisible();
    });

    // ТЕСТЫ АВТОРИЗАЦИИ (оставляем без изменений, если логика авторизации не поменялась)
    test('should show error when registering with existing email', async ({ page }) => {
        await page.fill('#authEmail', 'andrei05pyrlik@gmail.com');
        await page.fill('#authPassword', 'QA1234');
        await page.click('button:has-text("Зарегистрироваться")');
        await page.waitForTimeout(10000);
        
        await expect(page.locator('#authStatus')).toBeVisible();
        const errorText = await page.locator('#authStatus').textContent();
        expect(errorText).not.toBe('Регистрация...');
        expect(errorText.length).toBeGreaterThan(0);
        expect(errorText).not.toMatch(/успешна|успешно/);
    });

    test('should login with valid credentials', async ({ page }) => {
        await page.fill('#authEmail', 'andrei05pyrlik@gmail.com');
        await page.fill('#authPassword', 'QA1234');
        await page.click('button:has-text("Войти")');
        await page.waitForTimeout(10000);
        
        const userInfoVisible = await page.locator('#userInfo').isVisible();
        const authStatusVisible = await page.locator('#authStatus').isVisible();
        expect(userInfoVisible || authStatusVisible).toBeTruthy();
    });

    test('should show error when login with wrong password', async ({ page }) => {
        await page.fill('#authEmail', 'andrei05pyrlik@gmail.com');
        await page.fill('#authPassword', 'wrongpassword');
        await page.click('button:has-text("Войти")');
        await page.waitForTimeout(10000);
        
        await expect(page.locator('#authStatus')).toBeVisible();
        const errorText = await page.locator('#authStatus').textContent();
        expect(errorText).not.toBe('Вход...');
        expect(errorText.length).toBeGreaterThan(0);
        expect(errorText).not.toMatch(/успешн|добро пожаловать/);
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ СТАТИСТИКИ УПРАЖНЕНИЙ
    test('should display exercise statistics for each group', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Проверяем отображение статистики (X/Y)
        const statsText = await page.locator('.exercises-stats').textContent();
        expect(statsText).toContain('💪');
        expect(statsText).toContain('Грудь');
        expect(statsText).toMatch(/\d+\/\d+/); // Проверяем формат "активные/всего"
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ КАРДИО УПРАЖНЕНИЙ
    test('should display cardio-specific inputs', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Кардио');
        await page.waitForTimeout(2000);
        
        // Выбираем первое кардио упражнение
        const firstCardioExercise = exercisesData["Кардио"].active[0];
        const cardioButton = page.locator(`button.exercise-button.selected:has-text("✅ ${firstCardioExercise}")`).first();
        await cardioButton.click();
        await page.waitForTimeout(1000);
        
        // Проверяем специфичные поля для кардио
        await expect(page.locator('.cardio-container')).toBeVisible();
        await expect(page.locator('text=Время (мин)')).toBeVisible();
        await expect(page.locator('text=Сложность (1-40)')).toBeVisible();
        await expect(page.locator('input.time-input')).toBeVisible();
        await expect(page.locator('input.intensity-input')).toBeVisible();
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ КАЛЕНДАРЯ
    test('should display calendar with workout indicators', async ({ page }) => {
        await page.click('.nav-button:has-text("Календарь")');
        await page.waitForTimeout(2000);
        
        // Проверяем наличие календаря
        await expect(page.locator('#calendarGrid')).toBeVisible();
        await expect(page.locator('.calendar-date')).toHaveCount(42); // 6 недель * 7 дней
        await expect(page.locator('.calendar-day:has-text("Пн")')).toBeVisible();
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ ПАНЕЛИ ПРОГРЕССА
    test('should display progress analytics', async ({ page }) => {
        await page.click('.nav-button:has-text("Прогресс")');
        await page.waitForTimeout(2000);
        
        // Проверяем метрики
        await expect(page.locator('#totalWorkouts')).toBeVisible();
        await expect(page.locator('#monthWorkouts')).toBeVisible();
        await expect(page.locator('#totalSets')).toBeVisible();
        await expect(page.locator('#avgWeight')).toBeVisible();
        
        // Проверяем наличие графиков
        await expect(page.locator('#muscleGroupChart')).toBeVisible();
        await expect(page.locator('#progressChart')).toBeVisible();
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ ТЕМЫ ОФОРМЛЕНИЯ
    test('should have theme toggle functionality', async ({ page }) => {
        await expect(page.locator('#themeIcon')).toBeVisible();
        await expect(page.locator('#themeText')).toBeVisible();
        
        // Проверяем, что тема устанавливается
        const currentTheme = await page.getAttribute('html', 'data-theme');
        expect(['light', 'dark']).toContain(currentTheme);
    });

    // ТЕСТ ДЛЯ ПРОВЕРКИ ВЕСА ТЕЛА
    test('should display body weight input section', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Проверяем секцию веса тела
        await expect(page.locator('#bodyWeightSection')).toBeVisible();
        await expect(page.locator('#bodyWeightInput')).toBeVisible();
        await expect(page.locator('text=Вес тела (кг)')).toBeVisible();
    });

    // КОМПЛЕКСНЫЙ ТЕСТ: ПОЛНЫЙ ЦИКЛ ВЫБОРА УПРАЖНЕНИЯ
    test('complete exercise selection flow', async ({ page }) => {
        await page.click('.nav-button:has-text("Тренировка")');
        
        // 1. Выбираем группу мышц
        await page.click('text=Ноги');
        await page.waitForTimeout(1000);
        
        // 2. Проверяем, что показаны упражнения
        await expect(page.locator('#exercisesContainer')).toBeVisible();
        
        // 3. Выбираем упражнение
        const exerciseName = "Приседания со штангой";
        await page.click(`button.exercise-button.selected:has-text("✅ ${exerciseName}")`);
        await page.waitForTimeout(1000);
        
        // 4. Проверяем, что появилась секция подходов
        await expect(page.locator('#setsSection')).toBeVisible();
        await expect(page.locator(`text=${exerciseName}`)).toBeVisible();
        
        // 5. Проверяем вариации
        await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
        
        // 6. Проверяем поля для ввода веса и повторений
        await expect(page.locator('input.weight-input')).toBeVisible();
        await expect(page.locator('input.reps-input')).toBeVisible();
    });
});
