import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

// Load other environment variables
dotenv.config();

// Define the base URL directly in config
const BASE_URL = process.env.BASE_URL || 'https://the-internet.herokuapp.com';
const API_BASE_URL = process.env.API_BASE_URL || 'https://the-internet.herokuapp.com';

// Define test type - can be UI, API, or BOTH
const TEST_TYPE = process.env.TEST_TYPE || 'UI';

// Define default test credentials
const TEST_USERNAME = process.env.TEST_USERNAME || 'tomsmith';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'SuperSecretPassword!';

// Make these values available through process.env to ensure they're available in step definitions
process.env.BASE_URL = BASE_URL;
process.env.API_BASE_URL = API_BASE_URL;
process.env.TEST_TYPE = TEST_TYPE;
process.env.TEST_USERNAME = TEST_USERNAME;
process.env.TEST_PASSWORD = TEST_PASSWORD;

// Log the test type being used
console.log(`Running tests in ${TEST_TYPE} mode`);

const testDir = defineBddConfig({
    features: 'features/**/*.feature',
    steps: 'src/steps/**/*.ts',
});

export default defineConfig({
    testDir,
    reporter: 'html',
    use: {
        // Set base URL for all tests
        baseURL: BASE_URL,
        // Set screenshot option
        screenshot: process.env.SCREENSHOT_ON_FAILURE === 'true' ? 'only-on-failure' : 'off',
    },
    // Set timeout from env variable or default to 30 seconds
    timeout: parseInt(process.env.DEFAULT_TIMEOUT || '30000'),

    // Define browser projects
    projects: [
        {
            name: 'chromium',
            use: {
                browserName: 'chromium',
            },
        },
        {
            name: 'firefox',
            use: {
                browserName: 'firefox',
            },
        },
        {
            name: 'webkit',
            use: {
                browserName: 'webkit',
            },
        },
    ],
});
