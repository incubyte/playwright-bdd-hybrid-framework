import { Page, Locator, expect } from '@playwright/test';

export class DashboardPage {
    readonly page: Page;
    readonly successMessage: Locator;
    readonly logoutButton: Locator;
    readonly pageHeading: Locator;

    constructor(page: Page) {
        this.page = page;
        this.successMessage = page.locator('#flash.success');
        this.logoutButton = page.locator('a.button');
        this.pageHeading = page.locator('h2');
    }

    async isPageLoaded() {
        await expect(this.pageHeading).toContainText('Secure Area');
        return true;
    }

    async getSuccessMessage() {
        return await this.successMessage.innerText();
    }

    async isSuccessMessageVisible() {
        return await this.successMessage.isVisible();
    }

    async logout() {
        await this.logoutButton.click();
    }
}
