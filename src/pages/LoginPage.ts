import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { log } from '../utils/logger';

export class LoginPage extends BasePage {
    readonly usernameInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly flashMessage: Locator;
    readonly pageHeading: Locator;

    constructor(page: Page) {
        super(page);
        this.usernameInput = page.locator('#username');
        this.passwordInput = page.locator('#password');
        this.loginButton = page.locator('button[type="submit"]');
        this.flashMessage = page.locator('#flash');
        this.pageHeading = page.locator('h2');
        log.debug('LoginPage initialized with locators');
    }

    async goto() {
        log.info('Navigating to login page');
        // Using Playwright's native method directly
        await this.page.goto('/login');
        await this.waitForPageLoad();
        log.debug('Login page loaded');
    }

    async login(username: string, password: string) {
        log.info(`Logging in with username: ${username}`);
        // Using Playwright's native methods directly
        log.debug('Filling username field');
        await this.usernameInput.fill(username);
        log.debug('Filling password field');
        await this.passwordInput.fill(password);
        log.debug('Clicking login button');
        await this.loginButton.click();
        await this.waitForPageLoad();
        log.info('Login form submitted');
    }

    async isPageLoaded() {
        log.debug('Verifying login page is loaded');
        // Still using BasePage's utility method for verification
        await this.verifyElementText(this.pageHeading, 'Login Page');
        log.info('Login page loaded successfully');
        return true;
    }

    async getFlashMessageText() {
        log.debug('Getting flash message text');
        // Using Playwright's native method directly
        const text = await this.flashMessage.innerText();
        log.debug(`Flash message text: "${text}"`);
        return text;
    }

    async isFlashMessageVisible() {
        log.debug('Checking if flash message is visible');
        // Using Playwright's native method directly
        const isVisible = await this.flashMessage.isVisible();
        log.debug(`Flash message visibility: ${isVisible}`);
        return isVisible;
    }
}
