import { test as base, createBdd } from 'playwright-bdd';
import { PageFactory } from '../pages/PageFactory';
import { ServiceFactory } from '../services/api/ServiceFactory';
import { log } from './logger';
import { Page } from '@playwright/test';

// Create the BDD hooks from the Playwright test instance
export const { Before, After } = createBdd(base);

Before(async function ({ page }) {
    log.debug('Executing Before hook');
})

// Register hooks for cleanup after each test
After(async function ({ page }) {
    log.debug('Executing After hook for cleanup');

    // Clean up Page objects
    try {
        if (page) {
            const pageFactory = PageFactory.getInstance(page);
            log.debug('Cleaning up Page objects');
            pageFactory.dispose();
            log.debug('Page objects cleanup completed');
        }
    } catch (error) {
        log.error('Error during Page objects cleanup:', error);
    }

    // Clean up Service objects
    try {
        const serviceFactory = ServiceFactory.getInstance();
        if (serviceFactory) {
            log.debug('Cleaning up Service objects');
            await serviceFactory.dispose();
            log.debug('Service objects cleanup completed');
        }
    } catch (error) {
        log.error('Error during Service objects cleanup:', error);
    }

    log.debug('After hook completed');
});
