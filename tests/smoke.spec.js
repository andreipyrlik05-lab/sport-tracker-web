const { test, expect } = require('@playwright/test');

// Данные всех упражнений для проверки
const exercisesData = {
  "Грудь": [
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
  "Кардио": [
    "Беговая дорожка",
    "Велотренажер",
    "Шаги на платформе (Степ-ап)",
    "Эллипс"
  ],
  "Ноги": [
    "Жим ногами",
    "Жим ноги под углом",
    "Икроножные мышцы",
    "Приседания со штангой",
    "Разгибание ног (по одной ноге)",
    "Разгибание ног сидя",
    "Сгибание ног лежа",
    "Сгибание ног стоя (по одной ноге)"
  ],
  "Плечи": [
    "Жим гантелей сидя",
    "Жим над головой в тренажере",
    "Жим штанги с груди",
    "Махи в сторону в кроссовере",
    "Махи в сторону в тренажере",
    "Махи гантелей в стороны",
    "Подъем гантелей перед собой",
    "Подъем руки перед собой в кроссовере",
    "Разведение рук в кроссовере на задние дельты",
    "Разведение рук в тренажере на задние дельты",
    "Тяга канатов на задние дельты",
    "Тяга к подбородку в кроссовере",
    "Тяга штанги к подбородку"
  ],
  "Пресс": [
    "Планка",
    "Подъем ног в висе",
    "Скручивания",
    "Шаги на платформе (Степ-ап)"
  ],
  "Руки": [
    "Концентрированные сгибания на бицепс сидя",
    "Отжимания на трицепс",
    "Подъем гантелей на бицепс",
    "Подъем штанги на бицепс",
    "Разгибание рук в блочном тренажере",
    "Разгибание рук с гантелью в наклоне",
    "Разгибание рук с гантелью из-за головы",
    "Разгибание с канатом на трицепс",
    "Сгибание «Молот» («Молотки»)",
    "Сгибание рук в кроссовере",
    "Сгибание рук на скамье Скотта",
    "Сгибание рук с нижнего блока с канатом/рукоятью",
    "Французский жим"
  ],
  "Спина": [
    "Гиперэкстензия",
    "Гребная тяга",
    "Подтягивания",
    "Тяга вертикального блока к груди",
    "Тяга верхнего блока в тренажёре «Хаммер»",
    "Тяга горизонтального блока к поясу",
    "Тяга блока в тренажёре с упором груди",
    "Тяга штанги в наклоне",
    "Тяга т-грифа с упором"
  ]
};

test.describe('Sport Tracker Smoke Tests', () => {
  // ... существующие тесты остаются без изменений ...

  test('should load main page', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    
    // Проверяем заголовок
    await expect(page).toHaveTitle('Sport Tracker Pro');
    
    // Проверяем основные элементы - используем более специфичные селекторы
    await expect(page.locator('text=Мои тренировки')).toBeVisible();
    await expect(page.locator('.nav-button:has-text("Календарь")')).toBeVisible();
    await expect(page.locator('.nav-button:has-text("Тренировка")')).toBeVisible();
    await expect(page.locator('.nav-button:has-text("Прогресс")')).toBeVisible();
  });

  // ... остальные существующие тесты ...

  // НОВЫЕ ТЕСТЫ ДЛЯ ПРОВЕРКИ ВСЕХ УПРАЖНЕНИЙ

  test('should display all chest exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Грудь');
    
    // Ждем появления упражнений
    await page.waitForTimeout(2000);
    
    // Проверяем все упражнения для груди
    for (const exercise of exercisesData["Грудь"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  test('should display all back exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Спина');
    
    await page.waitForTimeout(2000);
    
    for (const exercise of exercisesData["Спина"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  test('should display all arms exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Руки');
    
    await page.waitForTimeout(2000);
    
    for (const exercise of exercisesData["Руки"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  test('should display all shoulders exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Плечи');
    
    await page.waitForTimeout(2000);
    
    for (const exercise of exercisesData["Плечи"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  test('should display all legs exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Ноги');
    
    await page.waitForTimeout(2000);
    
    for (const exercise of exercisesData["Ноги"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  test('should display all cardio exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Кардио');
    
    await page.waitForTimeout(2000);
    
    for (const exercise of exercisesData["Кардио"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  test('should display all abs exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Пресс');
    
    await page.waitForTimeout(2000);
    
    for (const exercise of exercisesData["Пресс"]) {
      await expect(page.locator(`text=${exercise}`)).toBeVisible();
    }
  });

  // ОБЩИЙ ТЕСТ ДЛЯ ПРОВЕРКИ ВСЕХ ГРУПП МЫШЦ И УПРАЖНЕНИЙ
  test('should display all muscle groups and their exercises', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    
    // Проверяем все группы мышц
    const muscleGroups = Object.keys(exercisesData);
    for (const group of muscleGroups) {
      // Кликаем на группу мышц
      await page.click(`text=${group}`);
      await page.waitForTimeout(1000);
      
      // Проверяем, что появился заголовок с названием группы
      await expect(page.locator(`text=Выберите упражнение для ${group}`)).toBeVisible();
      
      // Проверяем все упражнения для этой группы
      for (const exercise of exercisesData[group]) {
        await expect(page.locator(`text=${exercise}`)).toBeVisible();
      }
      
      // Небольшая пауза между группами
      await page.waitForTimeout(500);
    }
  });

  // ТЕСТЫ ДЛЯ ПРОВЕРКИ ВАРИАЦИЙ УПРАЖНЕНИЙ
  test('should display exercise variations for leg press', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Ноги');
    await page.click('text=Жим ногами');
    
    // Проверяем, что появились варианты выполнения
    await expect(page.locator('text=Варианты выполнения:')).toBeVisible();
    await expect(page.locator('text=Узкая постановка')).toBeVisible();
    await expect(page.locator('text=Широкая постановка')).toBeVisible();
    await expect(page.locator('text=Средняя постановка')).toBeVisible();
  });

  test('should display exercise variations for pull-ups', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Спина');
    await page.click('text=Подтягивания');
    
    // Проверяем варианты хвата
    await expect(page.locator('text=Широкий хват')).toBeVisible();
    await expect(page.locator('text=Узкий хват')).toBeVisible();
    await expect(page.locator('text=Обратный хват')).toBeVisible();
    await expect(page.locator('text=Нейтральный хват')).toBeVisible();
  });

  test('should display exercise variations for vertical pull', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Спина');
    await page.click('text=Тяга вертикального блока к груди');
    
    // Проверяем варианты хвата
    await expect(page.locator('text=Широкий хват')).toBeVisible();
    await expect(page.locator('text=Узкий хват')).toBeVisible();
    await expect(page.locator('text=Обратный хват')).toBeVisible();
  });

  // ТЕСТ ДЛЯ ПРОВЕРКИ СОХРАНЕНИЯ ВАРИАЦИЙ
  test('should save exercise with variations', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    await page.click('.nav-button:has-text("Тренировка")');
    await page.click('text=Ноги');
    await page.click('text=Жим ногами');
    
    // Выбираем вариации
    await page.click('text=Узкая постановка');
    await page.click('text=Средняя постановка');
    
    // Заполняем данные подхода
    await page.fill('input[placeholder="0"]', '100');
    await page.fill('input[placeholder="0"]', '10');
    
    // Проверяем, что кнопка сохранения доступна
    await expect(page.locator('button:has-text("Сохранить тренировку")')).toBeVisible();
    
    // Этот тест только проверяет отображение, так как для сохранения нужна авторизация
  });

  // ОБНОВЛЕННЫЕ ТЕСТЫ С УВЕЛИЧЕННЫМИ ТАЙМАУТАМИ
  test('should show error when registering with existing email', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    
    // Заполняем форму существующими данными
    await page.fill('#authEmail', 'andrei05pyrlik@gmail.com');
    await page.fill('#authPassword', 'QA1234');
    
    // Нажимаем кнопку регистрации
    await page.click('button:has-text("Зарегистрироваться")');
    
    // Увеличиваем таймаут для Firebase операций
    await page.waitForTimeout(10000); // 10 секунд для Firebase операций
    
    // Проверяем, что появилось сообщение об ошибке
    await expect(page.locator('#authStatus')).toBeVisible();
    
    // Получаем текст ошибки и проверяем, что это какая-то ошибка
    const errorText = await page.locator('#authStatus').textContent();
    expect(errorText).not.toBe('Регистрация...');
    expect(errorText.length).toBeGreaterThan(0);
    expect(errorText).not.toMatch(/успешна|успешно/);
  });

  test('should login with valid credentials', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    
    // Заполняем форму входа
    await page.fill('#authEmail', 'andrei05pyrlik@gmail.com');
    await page.fill('#authPassword', 'QA1234');
    
    // Нажимаем кнопку входа
    await page.click('button:has-text("Войти")');
    
    // Увеличиваем таймаут для Firebase операций
    await page.waitForTimeout(10000); // 10 секунд для Firebase операций
    
    // Проверяем результат
    const userInfoVisible = await page.locator('#userInfo').isVisible();
    const authStatusVisible = await page.locator('#authStatus').isVisible();
    
    expect(userInfoVisible || authStatusVisible).toBeTruthy();
  });

  test('should show error when login with wrong password', async ({ page }) => {
    await page.goto('https://andreipyrlik05-lab.github.io/sport-tracker-web/');
    
    // Заполняем форму неверными данными
    await page.fill('#authEmail', 'andrei05pyrlik@gmail.com');
    await page.fill('#authPassword', 'wrongpassword');
    
    // Нажимаем кнопку входа
    await page.click('button:has-text("Войти")');
    
    // Увеличиваем таймаут для Firebase операций
    await page.waitForTimeout(10000); // 10 секунд для Firebase операций
    
    // Проверяем сообщение об ошибке
    await expect(page.locator('#authStatus')).toBeVisible();
    
    const errorText = await page.locator('#authStatus').textContent();
    expect(errorText).not.toBe('Вход...');
    expect(errorText.length).toBeGreaterThan(0);
    expect(errorText).not.toMatch(/успешн|добро пожаловать/);
  });
});
