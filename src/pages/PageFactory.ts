import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';
import { log } from '../utils/logger';

export class PageFactory {
    private static instance: PageFactory | undefined;
    private pageInstances: Map<string, any> = new Map();
    private page: Page;

    private constructor(page: Page) {
        this.page = page;
        log.debug('PageFactory instance created');
    }

    public static getInstance(page: Page): PageFactory {
        if (!PageFactory.instance) {
            log.debug('Creating new PageFactory instance');
            PageFactory.instance = new PageFactory(page);
        } else {
            log.debug('Updating existing PageFactory instance with new page object');
            PageFactory.instance.page = page;
            PageFactory.instance.pageInstances.clear();
            log.debug('Page instances cache cleared');
        }
        return PageFactory.instance;
    }

    public getLoginPage(): LoginPage {
        if (!this.pageInstances.has('loginPage')) {
            log.debug('Creating new LoginPage instance');
            this.pageInstances.set('loginPage', new LoginPage(this.page));
        } else {
            log.debug('Returning cached LoginPage instance');
        }
        return this.pageInstances.get('loginPage');
    }

    public getDashboardPage(): DashboardPage {
        if (!this.pageInstances.has('dashboardPage')) {
            log.debug('Creating new DashboardPage instance');
            this.pageInstances.set('dashboardPage', new DashboardPage(this.page));
        } else {
            log.debug('Returning cached DashboardPage instance');
        }
        return this.pageInstances.get('dashboardPage');
    }

    public getPage<T>(key: string, type: new (page: Page) => T): T {
        if (!this.pageInstances.has(key)) {
            log.debug(`Creating new instance for page type: ${key}`);
            this.pageInstances.set(key, new type(this.page));
        } else {
            log.debug(`Returning cached instance for page type: ${key}`);
        }
        return this.pageInstances.get(key);
    }

    public dispose(): void {
        try {
            log.debug('Disposing PageFactory resources');
            this.pageInstances.clear();
            PageFactory.instance = undefined;
            log.debug('PageFactory resources disposed successfully');
        } catch (error) {
            log.error('Error disposing PageFactory resources:', error);
            throw error;
        }
    }
}
