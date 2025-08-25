import { defineConfig } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';

const testDir = defineBddConfig({
    features: 'features/**/*.feature',
    steps: 'src/steps/**/*.ts',
});

export default defineConfig({
    testDir,
    reporter: 'html',
});
