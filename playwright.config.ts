import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Define base URLs (hardcoded as requested)
const BASE_URL = 'https://your-webapp.com';
const API_BASE_URL = 'https://your-api.com/v1';

// Define test credentials and other configurations from .env with fallbacks
const TEST_USER_EMAIL = process.env.TEST_USER_EMAIL || 'testuser@example.com';
const TEST_USER_PASSWORD = process.env.TEST_USER_PASSWORD || 'supersecretpassword';
const TEST_TYPE = process.env.TEST_TYPE || 'UI';
const LOG_LEVEL= process.env.LOG_LEVEL || 'info';

// Make these variables available globally
process.env.BASE_URL = BASE_URL;
process.env.API_BASE_URL = API_BASE_URL;
process.env.TEST_USER_EMAIL = TEST_USER_EMAIL;
process.env.TEST_USER_PASSWORD = TEST_USER_PASSWORD;
process.env.TEST_TYPE = TEST_TYPE;
process.env.LOG_LEVEL = LOG_LEVEL;

// Define the BDD test directory and required files
const testDir = defineBddConfig({
    paths: ['features/**/*.feature'], // Where to find feature files
    require: ['src/steps/**/*.ts', 'src/support/**/*.ts'], // Where to find step definitions and support code
});

// Playwright configuration
export default defineConfig({
    testDir,
    reporter: [
        ['list'], // Simple console reporter
        ['allure-playwright', { outputFolder: 'allure-results' }], // Allure reporter
    ],
    use: {
        baseURL: BASE_URL,
        trace: 'on-first-retry',
    },
});
