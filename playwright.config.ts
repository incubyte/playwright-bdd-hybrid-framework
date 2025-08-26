import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

// Load other environment variables
dotenv.config();

// Define the base URL directly in config
const BASE_URL = process.env.BASE_URL || 'https://the-internet.herokuapp.com';
const API_BASE_URL = process.env.API_BASE_URL || 'https://the-internet.herokuapp.com';

// Define test type - can be UI or API
const TEST_TYPE = process.env.TEST_TYPE || 'UI';

// Define logging level - defaults to info if not specified
const LOG_LEVEL = process.env.LOG_LEVEL || 'info';

// Define default test credentials
const TEST_USERNAME = process.env.TEST_USERNAME || 'tomsmith';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SuperSecretPassword!';

// Make these values available through process.env to ensure they're available in step definitions
process.env.BASE_URL = BASE_URL;
process.env.API_BASE_URL = API_BASE_URL;
process.env.TEST_TYPE = TEST_TYPE;
process.env.TEST_USERNAME = TEST_USERNAME;
process.env.TEST_PASSWORD = TEST_PASSWORD;
process.env.LOG_LEVEL = LOG_LEVEL;

// Log the test type and logging level being used
console.log(`Running tests in ${TEST_TYPE} mode with logging level: ${LOG_LEVEL}`);

const testDir = defineBddConfig({
    features: 'features/**/*.feature',
    steps: 'src/steps/**/*.ts',
});

export default defineConfig({
    testDir,
    // Configure multiple reporters: HTML and Allure
    reporter: [
        ['html'],
        ['allure-playwright', {
            detail: true,
            outputFolder: 'allure-results',
            suiteTitle: false
        }]
    ],
    // Enable fully parallel test execution
    fullyParallel: true,
    use: {
        // Set base URL for all tests
        baseURL: BASE_URL,
        // Set screenshot option
        screenshot: process.env.SCREENSHOT_ON_FAILURE === 'true' ? 'only-on-failure' : 'off',
        // Enable trace for Allure reporting
        trace: 'retain-on-failure',
    },
    // Set timeout from env variable or default to 30 seconds
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),

    // Define projects with UI and API categories for better Allure reporting
    projects: [
        // UI Category - Contains all browser tests
        {
            name: 'ui-chromium',
            testMatch: /.*\.feature/,
            use: {
                browserName: 'chromium',
            },
            metadata: {
                type: 'UI'
            }
        },
        {
            name: 'ui-firefox',
            testMatch: /.*\.feature/,
            use: {
                browserName: 'firefox',
            },
            metadata: {
                type: 'UI'
            }
        },
        {
            name: 'ui-webkit',
            testMatch: /.*\.feature/,
            use: {
                browserName: 'webkit',
            },
            metadata: {
                type: 'UI'
            }
        },

        // API Category - No browser needed
        {
            name: 'api',
            testMatch: /.*\.feature/,
            use: {
                // Use a browser-less context for API tests
                browserName: 'chromium',
                headless: true
            },
            metadata: {
                type: 'API'
            }
        }
    ],
});
