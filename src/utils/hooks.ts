import { test as base, createBdd } from 'playwright-bdd';
import { ServiceFactory } from '../services/api/ServiceFactory';
import { log } from './logger';

// Create the BDD hooks from the Playwright test instance
export const { Before, After } = createBdd(base);

Before(async function ({ page }) {
    log.debug('Executing Before hook');
})

// Register hooks for cleanup after each test
After(async function ({ page }) {
    log.debug('Executing After hook for cleanup');

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
