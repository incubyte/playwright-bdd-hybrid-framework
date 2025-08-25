import { Page, Locator, expect } from '@playwright/test';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
    }

    async waitForPageLoad() {
        await this.page.waitForLoadState('networkidle');
    }

    async verifyPageTitle(title: string) {
        await expect(this.page).toHaveTitle(new RegExp(title));
    }

    async verifyURL(urlPath: string) {
        await expect(this.page).toHaveURL(new RegExp(urlPath));
    }

    async takeScreenshot(name: string) {
        await this.page.screenshot({ path: `./screenshots/${name}.png` });
    }

    async verifyElementText(locator: Locator, text: string) {
        await expect(locator).toContainText(text);
    }
}
