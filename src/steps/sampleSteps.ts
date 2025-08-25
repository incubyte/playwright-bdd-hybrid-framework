import { expect, Page } from '@playwright/test';
import { createBdd } from 'playwright-bdd';
import dotenv from 'dotenv';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// Load environment variables
dotenv.config();

// Define an interface for the context passed to step functions
interface BddContext {
  page: Page;
}

const { Given, When, Then } = createBdd<BddContext>();

Given('I am on the login page', async ({ page }: BddContext) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.isPageLoaded();
});

When('I enter valid credentials', async ({ page }: BddContext) => {
    const loginPage = new LoginPage(page);
    await loginPage.login(process.env.TEST_USERNAME!, process.env.TEST_PASSWORD!);
});

Then('I should be redirected to the dashboard', async ({ page }: BddContext) => {
    const dashboardPage = new DashboardPage(page);

    // Verify we're on the secure page
    await expect(page).toHaveURL(/\/secure$/);
    await dashboardPage.isPageLoaded();

    // Verify success message
    await expect(dashboardPage.successMessage).toBeVisible();
    const message = await dashboardPage.getSuccessMessage();
    await expect(message).toContain('You logged into a secure area!');

    // Verify logout button
    await expect(dashboardPage.logoutButton).toContainText('Logout');
});
