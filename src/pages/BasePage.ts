import { Page, Locator, expect } from '@playwright/test';
import { log } from '../utils/logger';

export class BasePage {
    readonly page: Page;

    constructor(page: Page) {
        this.page = page;
        log.debug(`BasePage initialized with page object`);
    }

    async waitForPageLoad() {
        log.debug('Waiting for page to reach networkidle state');
        await this.page.waitForLoadState('networkidle');
        log.debug('Page load completed');
    }

    async verifyPageTitle(title: string) {
        log.debug(`Verifying page title matches "${title}"`);
        await expect(this.page).toHaveTitle(new RegExp(title));
        log.debug('Page title verified successfully');
    }

    async verifyURL(urlPath: string) {
        log.debug(`Verifying URL contains "${urlPath}"`);
        await expect(this.page).toHaveURL(new RegExp(urlPath));
        log.debug('URL verified successfully');
    }

    async takeScreenshot(name: string) {
        log.info(`Taking screenshot: ${name}`);
        await this.page.screenshot({ path: `./screenshots/${name}.png` });
        log.debug(`Screenshot saved to ./screenshots/${name}.png`);
    }

    async verifyElementText(locator: Locator, text: string) {
        log.debug(`Verifying element contains text: "${text}"`);
        await expect(locator).toContainText(text);
        log.debug('Element text verified successfully');
    }
}
