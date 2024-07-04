const { test, describe, beforeEach, expect } = require('@playwright/test');
const { loginWith } = require('./helper');
const { timeout } = require('../playwright.config');
// const { afterEach } = require('node:test');

describe('Blog app', () => {
    beforeEach(async ({ page, request }) => {
        // Reset the db
        await request.post('http://localhost:3003/api/testing/reset');

        // Create users for the backend
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Matti Luukkainen',
                username: 'mluukkai',
                password: 'salainen',
            },
        });
        await request.post('http://localhost:3003/api/users', {
            data: {
                name: 'Arto Hellas',
                username: 'hellas',
                password: 'salainen2',
            },
        });
        // Go to the application
        await page.goto('http://localhost:5173');
        const locator = await page.getByText('Blogs');
        await expect(locator).toBeVisible();
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
            await loginWith(page, 'mluukkai', 'salainen');

            // Check for successful login notification message
            const successDiv = await page.locator('.notification-message');
            await expect(successDiv).toContainText('Login successful');
        });

        test('fails with wrong credentials', async ({ page }) => {
            // Try with wrong password
            await loginWith(page, 'mluukkai', 'salinen');

            const errorDiv = await page.locator('.notification-message');
            await expect(errorDiv).toContainText('wrong username or password');
        });
    });

    describe('User logged in', () => {
        beforeEach(async ({ page }) => {
            // Log in before each test
            await loginWith(page, 'mluukkai', 'salainen');

            // Check for successful user login
            const successDiv = await page.locator('.notification-message');
            await expect(successDiv).toContainText('Login successful');
        });

        test('a new blog can be created', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click();
            await page.getByTestId('title').fill('New Blog Title via Test');
            await page.getByTestId('author').fill('Blog Author via Test');
            await page.getByTestId('url').fill('http://madebytest.fi');
            await page.getByRole('button', { name: 'create' }).click();

            const newBlog = await page.getByText('New Blog Title via Test Blog Author via Test');
            await expect(newBlog).toBeVisible();
        });

        test('a blog can be liked', async ({ page }) => {
            await page.getByRole('button', { name: 'new blog' }).click();
            await page.getByTestId('title').fill('Blog to test likes');
            await page.getByTestId('author').fill('Blog Author via Test');
            await page.getByTestId('url').fill('http://madebytest2bliked.fi');
            await page.getByRole('button', { name: 'create' }).click();

            const newBlog = await page.getByText('Blog to test likes Blog Author via Test');
            await expect(newBlog).toBeVisible();

            // Show the blog post details
            await page.locator('.show-hide-btn').click();

            // Click the like btn
            await page.locator('.like-btn').click();

            // Check if like count is 1 (blog created with default 0 likes)
            const likeCount = await page.locator('.like-count');
            await expect(likeCount).toContainText('1');
            // Log out
            await page.getByRole('button', { name: 'logout' }).click();
        });

        test('a blog can be deleted by the user who created it', async ({ page }) => {
            // Create blog
            await page.getByRole('button', { name: 'new blog' }).click();
            await page.getByTestId('title').fill('Blog to be deleted');
            await page.getByTestId('author').fill('Blog added by Matti Luukkainen');
            await page.getByTestId('url').fill('http://madebytest2bdeleted.fi');
            await page.getByRole('button', { name: 'create' }).click();

            const newBlog = await page.getByText('Blog to be deleted Blog added by Matti Luukkainen');
            await expect(newBlog).toBeVisible();

            // Show the blog post details
            await page.locator('.show-hide-btn').click();

            // Setting up the event listener to accept the dialog
            page.once('dialog', dialog => dialog.accept());

            // Delete the blog
            await page.getByRole('button', { name: 'remove' }).click();

            // Refresh the page to ensure the blog is completely removed
            await page.reload();

            await expect(newBlog).not.toBeVisible();
        });

        test('a blog can not be deleted by a user who did not created it', async ({ page }) => {
            // Create blog
            await page.getByRole('button', { name: 'new blog' }).click();
            await page.getByTestId('title').fill('Blog cannot be deleted');
            await page.getByTestId('author').fill('Blog added by Matti Luukkainen');
            await page.getByTestId('url').fill('http://blognotdeleted.fi');
            await page.getByRole('button', { name: 'create' }).click();

            const newBlog = await page.getByText('Blog cannot be deleted Blog added by Matti Luukkainen');
            await expect(newBlog).toBeVisible();

            // Log out
            await page.getByRole('button', { name: 'logout' }).click();

            // Log in as Arto Hellas
            await loginWith(page, 'hellas', 'salainen2');

            // Show the blog post details
            await page.locator('.show-hide-btn').click();

            // Try to delete the blog
            const removeBtn = await page.getByRole('button', { name: 'remove' });
            await expect(removeBtn).not.toBeVisible();
        });
    });
});