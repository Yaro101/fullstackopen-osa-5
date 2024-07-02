const { test, describe, beforeEach, expect } = require('@playwright/test');


// describe('Blog app', () => {
//   test('front page can be opened', async ({ page }) => {
//     await page.goto('http://localhost:5173');

//     const locator = await page.getByText('Blogs');
//     await expect(locator).toBeVisible();
//   });
describe('Blog app', () => {
  beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });
  test('login form is shown', async ({ page }) => {
    await page.goto('http://localhost:5173');

    await page.getByRole('button', { name: 'login' }).click();
    await page.getByTestId('username').fill('Timmi');
    await page.getByTestId('password').fill('salainen2');
    await page.getByRole('button', { name: 'login' }).click();

    await expect(page.getByText('Timmi the Coding Cat logged-in')).toBeVisible();
  });
});