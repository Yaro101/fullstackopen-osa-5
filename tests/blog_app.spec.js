const { test, describe, beforeEach, expect } = require('@playwright/test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
    // Reset the db
        await request.post('http:localhost:3003/api/testing/reset');
        // Create a user for the backend
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai2',
                password: 'salainen',
            },
        });

        // Go to the application
        await page.goto('http://localhost:5173');
    });

    // Test the form
    test('login form is shown', async ({ page }) => {
        await page.goto('http://localhost:5173');
        await page.getByRole('button', { name: 'login' }).click();
        await expect(page.locator('form')).toBeVisible();
    });

    // Test login
    describe('Login', () => {
        test('succeeds with correct credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click();
            await page.getByTestId('username').fill('mluukkai2');
            await page.getByTestId('password').fill('salainen');
            await page.getByRole('button', { name: 'login' }).click();

            // Check for successful login notification message
            const successDiv = await page.locator('.notification-message');
            await expect(successDiv).toContainText('Login successful');
        });

        test('fails with wrong credentials', async ({ page }) => {
            await page.getByRole('button', { name: 'login' }).click();
            await page.getByTestId('username').fill('mluukkai');
            await page.getByTestId('password').fill('salain');
            await page.getByRole('button', { name: 'login' }).click();

            const errorDiv = await page.locator('.notification-message');
            await expect(errorDiv).toContainText('wrong username or password');
        });
    });
});