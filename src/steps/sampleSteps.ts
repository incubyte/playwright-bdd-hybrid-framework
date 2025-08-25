import { expect, Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';

// Define an interface for the context passed to step functions
interface BddContext {
  page: Page;
}

const { Given, When, Then } = createBdd<BddContext>();

Given('I am on the login page', async ({ page }: BddContext) => {
    await page.goto('https://the-internet.herokuapp.com/login');
});

When('I enter valid credentials', async ({ page }: BddContext) => {
    await page.locator('#username').fill('tomsmith');
    await page.locator('#password').fill('SuperSecretPassword!');
    await page.locator('button[type="submit"]').click();
});

Then('I should be redirected to the dashboard', async ({ page }: BddContext) => {
    await expect(page).toHaveURL(/\/secure$/);

    const flashMessage = page.locator('#flash.success');
    await expect(flashMessage).toBeVisible();
    await expect(flashMessage).toContainText('You logged into a secure area!');

    await expect(page.locator('a.button')).toContainText('Logout');
});
