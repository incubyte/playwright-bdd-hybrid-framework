# Playwright BDD Anti-Pattern Taxonomy

Priority levels used during code review:
- **P0** — Must fix before merge. Correctness, reliability, or security broken.
- **P1** — Should fix. High flakiness or maintainability risk.
- **P2** — Medium. Misleading patterns, minor reliability issues.
- **P3** — Suggestions. Style, noise reduction, completeness.

---

## P0 — Critical (Block Merge)

### P0-1: Silent test pass on API failure
```typescript
// BAD — catch injects mock success, test always passes
} catch (error) {
  apiContext.loginResponse = { authenticated: true, token: 'mock-token' };
  apiContext.statusCode = 200;
}

// GOOD — rethrow so the step fails
} catch (error) {
  log.error('API error:', error);
  throw error;
}
```

### P0-2: Hardcoded credentials in source
```typescript
// BAD
const username = process.env.TEST_USERNAME || 'tomsmith';
const password = process.env.TEST_PASSWORD || 'SuperSecretPassword!';

// GOOD — fail fast with clear message
const username = process.env.TEST_USERNAME;
const password = process.env.TEST_PASSWORD;
if (!username || !password) throw new Error('TEST_USERNAME and TEST_PASSWORD must be set');
```

### P0-3: Deprecated Playwright selectors
```typescript
// BAD
await page.$('#element');
await page.$$('.items');
await page.evaluate(el => el.innerHTML, locator);

// GOOD
await page.locator('#element');
await page.locator('.items').all();
await expect(locator).toHaveText('expected');
```

### P0-4: `innerHTML` / `innerText` used in assertions
```typescript
// BAD — brittle, returns raw HTML/text without retries
const text = await element.innerText();
expect(text).toBe('Submit');

// GOOD — retries, actionability checks
await expect(element).toHaveText('Submit');
```

---

## P1 — High Priority (Should Fix)

### P1-1: `waitForLoadState('networkidle')` as primary wait
```typescript
// BAD — fragile on polling pages, analytics, lazy-loads
await this.page.waitForLoadState('networkidle');

// GOOD — wait for a meaningful DOM element or URL
await this.loginButton.waitFor({ state: 'visible' });
await this.page.waitForURL(/\/secure$/);
```

### P1-2: Module-level mutable state in step definitions
```typescript
// BAD — bleeds between scenarios in same worker
let loginPage: LoginPage;
const apiContext: ApiContext = { loginResponse: null };

// GOOD — reset at start of each step / use Before hook
apiContext.loginResponse = null;
apiContext.statusCode = undefined;
```

### P1-3: Non-null assertion on env vars
```typescript
// BAD — undefined at runtime = silent bad request
const username = process.env.TEST_USERNAME!;

// GOOD — fail fast
const username = process.env.TEST_USERNAME;
if (!username) throw new Error('TEST_USERNAME not set');
```

### P1-4: API test project launching browser
```typescript
// BAD — Chromium startup overhead for API tests
{ name: 'api', use: { browserName: 'chromium', headless: true } }

// GOOD
{ name: 'api', use: {} }
```

### P1-5: `waitForTimeout` / hardcoded sleeps
```typescript
// BAD
await page.waitForTimeout(2000);

// GOOD
await locator.waitFor({ state: 'visible' });
```

### P1-6: `{ force: true }` bypassing actionability
```typescript
// BAD — hides real UI bugs
await element.click({ force: true });

// GOOD — fix the root cause (scroll, wait for visible)
await element.scrollIntoViewIfNeeded();
await element.click();
```

---

## P2 — Medium Priority

### P2-1: Misleading boolean return from assertion methods
```typescript
// BAD — return value never used; return type misleads callers
async isPageLoaded(): Promise<boolean> {
  await this.verifyElementText(this.pageHeading, 'Login Page');
  return true;
}

// GOOD
async assertPageLoaded(): Promise<void> {
  await this.verifyElementText(this.pageHeading, 'Login Page');
}
```

### P2-2: Logger silent failure on unrecognised LOG_LEVEL
```typescript
// BAD — undefined comparison silences all logging
const configuredLevel = LOG_LEVEL_MAP[process.env.LOG_LEVEL?.toLowerCase() || 'info'];

// GOOD
const configuredLevel = LOG_LEVEL_MAP[process.env.LOG_LEVEL?.toLowerCase() || 'info'] ?? LogLevel.INFO;
```

### P2-3: Dead fields in interfaces
```typescript
// BAD — never read anywhere
interface BddContext {
  page: Page;
  apiResponse?: unknown; // dead
}
```

### P2-4: Redundant `dotenv.config()` in step files
- `playwright.config.ts` already calls it; calling again in steps is noise.

### P2-5: Screenshot dir not guaranteed to exist
```typescript
// BAD — throws ENOENT if screenshots/ absent
await this.page.screenshot({ path: `./screenshots/${name}.png` });

// GOOD
import { mkdirSync } from 'fs';
mkdirSync('./screenshots', { recursive: true });
await this.page.screenshot({ path: `./screenshots/${name}.png` });
```

### P2-6: Misleading log message on singleton creation
```typescript
// BAD — fires even when instance was just created
log.debug('Returning existing ServiceFactory instance'); // outside else

// GOOD — inside else
} else {
  log.debug('Returning existing ServiceFactory instance');
}
```

### P2-7: API client parses JSON from HTML redirect endpoint
- `/authenticate` returns 302 HTML, not JSON. Asserting `response.ok()` and then calling `response.json()` always throws.
- Inspect status code and redirect `Location` header instead.

### P2-8: `tsconfig.json` including non-TS files
```json
// BAD — .feature files are not TypeScript
"include": ["src/**/*", "features/**/*"]

// GOOD
"include": ["src/**/*", "features/**/*.ts", "playwright.config.ts"]
```

---

## P3 — Low Priority (Suggestions)

### P3-1: Noisy constructor logging in page objects
- `log.debug('LoginPage initialized')` in every constructor adds noise with no diagnostic value. Remove.

### P3-2: No-op hooks
```typescript
// BAD — allocates, runs, does nothing
Before(async function () {
  log.debug('Executing Before hook');
});
```
Remove until it has actual logic.

### P3-3: Orphan tags with no filter purpose
- `@Sample` on scenarios — either document its purpose or remove it.

### P3-4: Redundant `cross-env` on `bddgen`
```json
// BAD — bddgen ignores LOG_LEVEL
"test:debug": "cross-env LOG_LEVEL=debug npx bddgen && cross-env LOG_LEVEL=debug npx playwright test --debug"

// GOOD
"test:debug": "npx bddgen && cross-env LOG_LEVEL=debug npx playwright test --debug"
```

### P3-5: No `workers` / `retries` for CI
```typescript
// Add to playwright.config.ts
workers: process.env.CI ? 2 : undefined,
retries: process.env.CI ? 1 : 0,
```

### P3-6: Missing `typescript` in `devDependencies`
- TypeScript used throughout but not listed explicitly. Add `"typescript": "^5.0.0"`.

### P3-7: Allure reporter/CLI version mismatch
- `allure-playwright` v3 + `allure-commandline` v2 → broken reports. Align both to v3.

---

## Keyword Elevation

Auto-escalate any finding to **P0** if it touches these domains:
- `auth`, `login`, `authentication`, `token`
- `password`, `credentials`, `secret`
- `payment`, `billing`
- `pii`, `phi`, `hipaa`, `security`

Example: A P2 issue in an auth step definition becomes P0.

---

## Auto-Fix Patterns

| Pattern | Find | Replace |
|---------|------|---------|
| networkidle | `waitForLoadState('networkidle')` | `waitFor({ state: 'visible' })` on element |
| innerText assert | `const t = await el.innerText(); expect(t).toBe(...)` | `await expect(el).toHaveText(...)` |
| non-null env | `process.env.FOO!` | guard + throw |
| isPageLoaded | `isPageLoaded(): Promise<boolean>` | `assertPageLoaded(): Promise<void>` |
| mock catch | catch block with mock success response | rethrow error |
