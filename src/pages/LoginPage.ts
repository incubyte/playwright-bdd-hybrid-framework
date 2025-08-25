import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

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
    }

    async goto() {
        // Using Playwright's native method directly
        await this.page.goto('/login');
        await this.waitForPageLoad();
    }

    async login(username: string, password: string) {
        // Using Playwright's native methods directly
        await this.usernameInput.fill(username);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        await this.waitForPageLoad();
    }

    async isPageLoaded() {
        // Still using BasePage's utility method for verification
        await this.verifyElementText(this.pageHeading, 'Login Page');
        return true;
    }

    async getFlashMessageText() {
        // Using Playwright's native method directly
        return await this.flashMessage.innerText();
    }

    async isFlashMessageVisible() {
        // Using Playwright's native method directly
        return await this.flashMessage.isVisible();
    }
}
