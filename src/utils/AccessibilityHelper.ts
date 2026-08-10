import { Page, test } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { createHtmlReport } from 'axe-html-reporter';

export class AccessibilityHelper {
  static async checkAccessibility(
    page: Page,
    options: {
      tags?: string[];
      exclude?: string[];
      reportName?: string;
      root?: string; // Selector for the component to scan
    } = {},
  ) {
    const builder = new AxeBuilder({ page });

    if (options.tags && options.tags.length > 0) {
      builder.withTags(options.tags);
    } else {
      // Default to WCAG 2.1 AA standard if no specific tags are provided
      builder.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']);
    }

    if (options.root) {
      builder.include(options.root);
    }

    if (options.exclude && options.exclude.length > 0) {
      options.exclude.forEach((selector) => builder.exclude(selector));
    }

    // Ensure page is stable before scanning
    await page.waitForLoadState('domcontentloaded');

    const results = await builder.analyze();

    if (results.violations.length > 0) {
      const reportName = options.reportName || 'accessibility-report';
      createHtmlReport({
        results: results,
        options: {
          projectKey: 'PLAYWRIGHT_BDD_HYBRID',
          outputDir: 'accessibility-reports',
          reportFileName: `${reportName}.html`,
        },
      });

      console.log(
        `Accessibility violations found! Report generated: accessibility-reports/${reportName}.html`,
      );

      const testInfo = test.info();
      if (testInfo) {
        await testInfo.attach('Accessibility HTML Report', {
          path: `accessibility-reports/${reportName}.html`,
          contentType: 'text/html',
        });
        await testInfo.attach('Accessibility Violations', {
          body: JSON.stringify(results.violations, null, 2),
          contentType: 'application/json',
        });
      }

      // Log violations for quick debugging
      results.violations.forEach((violation) => {
        console.log(`Violation: ${violation.id} - ${violation.help}`);
        violation.nodes.forEach((node) => {
          console.log(`  Target: ${node.target}`);
        });
      });

      throw new Error(
        `Accessibility violations found: ${results.violations.length} violations. See report for details.`,
      );
    }
  }
}
