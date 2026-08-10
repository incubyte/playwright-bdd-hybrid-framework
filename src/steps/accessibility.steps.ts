import { createBdd } from 'playwright-bdd';
import { AccessibilityHelper } from '../utils/AccessibilityHelper';
import { test } from '@playwright/test';

const { Given, When, Then } = createBdd();

Then('I check for accessibility violations', async ({ page }) => {
  const testInfo = test.info();
  const reportName = `accessibility-report-${testInfo.title.replace(/\s+/g, '-').toLowerCase()}`;
  await AccessibilityHelper.checkAccessibility(page, { reportName });
});

Then('I check for accessibility violations with tags {string}', async ({ page }, tags: string) => {
  const testInfo = test.info();
  const tagList = tags.split(',').map((t) => t.trim());
  const reportName = `accessibility-report-${testInfo.title.replace(/\s+/g, '-').toLowerCase()}`;
  await AccessibilityHelper.checkAccessibility(page, { tags: tagList, reportName });
});

Then(
  'I check for accessibility violations excluding {string}',
  async ({ page }, exclude: string) => {
    const testInfo = test.info();
    const excludeList = exclude.split(',').map((t) => t.trim());
    const reportName = `accessibility-report-${testInfo.title.replace(/\s+/g, '-').toLowerCase()}`;
    await AccessibilityHelper.checkAccessibility(page, { exclude: excludeList, reportName });
  },
);

Then('I check for accessibility violations on the {string}', async ({ page }, selector: string) => {
  const testInfo = test.info();
  const reportName = `accessibility-report-${testInfo.title.replace(/\s+/g, '-').toLowerCase()}`;
  await AccessibilityHelper.checkAccessibility(page, { root: selector, reportName });
});
