const { test, expect } = require('@playwright/test');

test.describe('Sport Tracker CI Tests', () => {
    test('should load main page', async ({ page }) => {
        console.log('Starting test...');
        await page.goto('https://logfitness.ru/', { timeout: 30000 });
        await page.waitForTimeout(3000);
        
        const title = await page.title();
        console.log('Page title:', title);
        expect(title).toContain('Sport Tracker');
    });

    test('should have basic navigation', async ({ page }) => {
        console.log('Checking navigation...');
        await page.goto('https://logfitness.ru/', { timeout: 30000 });
        await page.waitForTimeout(3000);
        
        // Проверяем основные кнопки навигации
        await expect(page.locator('text=Мои тренировки')).toBeVisible();
        await expect(page.locator('.nav-button:has-text("Календарь")')).toBeVisible();
        await expect(page.locator('.nav-button:has-text("Тренировка")')).toBeVisible();
        await expect(page.locator('.nav-button:has-text("Прогресс")')).toBeVisible();
    });

    test('should navigate to workout tab', async ({ page }) => {
        console.log('Navigating to workout...');
        await page.goto('https://logfitness.ru/', { timeout: 30000 });
        await page.waitForTimeout(3000);
        
        await page.click('.nav-button:has-text("Тренировка")');
        await page.waitForTimeout(2000);
        
        // Проверяем, что появились группы мышц
        await expect(page.locator('#groupsContainer')).toBeVisible();
    });

    test('should display at least one muscle group', async ({ page }) => {
        console.log('Checking muscle groups...');
        await page.goto('https://logfitness.ru/', { timeout: 30000 });
        await page.waitForTimeout(3000);
        
        await page.click('.nav-button:has-text("Тренировка")');
        await page.waitForTimeout(2000);
        
        // Проверяем хотя бы одну группу мышц
        const groups = ['Грудь', 'Спина', 'Ноги'];
        let foundGroup = false;
        
        for (const group of groups) {
            const groupButton = page.locator(`text=${group}`);
            if (await groupButton.count() > 0) {
                console.log(`Found group: ${group}`);
                foundGroup = true;
                break;
            }
        }
        
        expect(foundGroup).toBeTruthy();
    });

    test('should display chest exercises', async ({ page }) => {
        console.log('Checking chest exercises...');
        await page.goto('https://logfitness.ru/', { timeout: 30000 });
        await page.waitForTimeout(3000);
        
        await page.click('.nav-button:has-text("Тренировка")');
        await page.waitForTimeout(2000);
        
        await page.click('text=Грудь');
        await page.waitForTimeout(2000);
        
        // Проверяем хотя бы одно упражнение для груди
        const chestExercises = ['Жим гантелей', 'Жим штанги', 'Разведение'];
        let foundExercise = false;
        
        for (const exercise of chestExercises) {
            const exerciseButton = page.locator(`button:has-text("${exercise}")`);
            if (await exerciseButton.count() > 0) {
                console.log(`Found exercise: ${exercise}`);
                foundExercise = true;
                break;
            }
        }
        
        expect(foundExercise).toBeTruthy();
    });
});
