import { Page } from '@playwright/test';
import { LoginPage } from './LoginPage';
import { DashboardPage } from './DashboardPage';

export class PageFactory {
    private static instance: PageFactory;
    private pageInstances: Map<string, any> = new Map();
    private page: Page;

    private constructor(page: Page) {
        this.page = page;
    }

    public static getInstance(page: Page): PageFactory {
        if (!PageFactory.instance) {
            PageFactory.instance = new PageFactory(page);
        } else {
            PageFactory.instance.page = page;
            PageFactory.instance.pageInstances.clear();
        }
        return PageFactory.instance;
    }

    public getLoginPage(): LoginPage {
        if (!this.pageInstances.has('loginPage')) {
            this.pageInstances.set('loginPage', new LoginPage(this.page));
        }
        return this.pageInstances.get('loginPage');
    }

    public getDashboardPage(): DashboardPage {
        if (!this.pageInstances.has('dashboardPage')) {
            this.pageInstances.set('dashboardPage', new DashboardPage(this.page));
        }
        return this.pageInstances.get('dashboardPage');
    }

    public getPage<T>(key: string, type: new (page: Page) => T): T {
        if (!this.pageInstances.has(key)) {
            this.pageInstances.set(key, new type(this.page));
        }
        return this.pageInstances.get(key);
    }
}
