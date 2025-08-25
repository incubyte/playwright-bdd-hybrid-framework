import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from '../utils/logger';

export class DashboardPage extends BasePage {
    readonly successMessage: Locator;
    readonly logoutButton: Locator;
    readonly pageHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.successMessage = page.locator('#flash.success');
        this.logoutButton = page.locator('a.button');
        this.pageHeading = page.locator('h2');
        log.debug('DashboardPage initialized with locators');
    }

    async isPageLoaded() {
        log.debug('Verifying dashboard page is loaded');
        await this.verifyElementText(this.pageHeading, 'Secure Area');
        log.info('Dashboard page loaded successfully');
        return true;
    }

    async getSuccessMessage() {
        log.debug('Getting success message text');
        const text = await this.successMessage.innerText();
        log.debug(`Success message text: "${text}"`);
        return text;
    }

    async isSuccessMessageVisible() {
        log.debug('Checking if success message is visible');
        const isVisible = await this.successMessage.isVisible();
        log.debug(`Success message visibility: ${isVisible}`);
        return isVisible;
    }

    async logout() {
        log.info('Logging out from dashboard');
        await this.logoutButton.click();
        log.debug('Logout button clicked');
        await this.waitForPageLoad();
        log.info('Logged out successfully');
    }
}
