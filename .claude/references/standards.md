# Playwright BDD Framework Standards

These standards apply to all test code in this repository. All PRs and local changes must comply before merge.

---

## Architecture Standards

### Page Objects

- Extend `BasePage` for all page classes
- Define all locators as `readonly Locator` in the constructor
- Prefer `getByRole`, `getByLabel`, `getByText` over CSS/XPath selectors
- Use `getByRole('button', { name: 'Submit' })` not `page.locator('button.submit')`
- Never instantiate pages via a factory — use `new LoginPage(page)` directly in step definitions
- Page methods must be `async` and return `Promise<void>` for actions
- Assertion methods must be named `assertXxx()` (not `isXxx()` or `verifyXxx()`) and return `Promise<void>`

### Wait Strategy

**Always use element-based waits. Never use `networkidle` or `waitForTimeout`.**

| Situation | Correct wait |
|-----------|-------------|
| After navigation | `await page.waitForURL(/pattern/)` |
| Before interacting with element | `await locator.waitFor({ state: 'visible' })` |
| After click that triggers new page state | `await locator.waitFor({ state: 'visible' })` on new element |
| After form submit | `await page.waitForURL(...)` |

### Step Definitions

- Located in `src/steps/`
- Always import hooks: `import '../utils/hooks'`
- Use `createBdd<BddContext>()` to type the context
- Check `process.env.TEST_TYPE` for UI vs API branching
- Never use module-level mutable state for page instances — reassign in Given step
- Reset `apiContext` state at start of When steps that perform API calls
- No `dotenv.config()` in step files — `playwright.config.ts` handles it

### API Clients

- Extend `BaseApiClient` for all API client classes
- Register clients in `ServiceFactory` via a `getXxxApiClient()` method
- Never manually dispose ServiceFactory in step definitions — After hook handles it
- Always use `ServiceFactory.getInstance()` — never `new ServiceFactory()`
- `handleLoginResponse` must inspect actual HTTP status, not assume JSON

### Hooks

- Defined in `src/utils/hooks.ts`
- After hook must call `ServiceFactory.getInstance().dispose()`
- Only register a Before hook when it has actual logic — no no-op hooks
- Never add test-specific cleanup in hooks; use step-level cleanup instead

---

## Environment Configuration

All credentials and config come from environment variables. **Never hardcode values as fallbacks.**

Required variables (must be set — framework throws if absent):
```
TEST_USERNAME     # login username
TEST_PASSWORD     # login password
```

Optional variables with safe defaults:
```
BASE_URL          # default: https://the-internet.herokuapp.com
API_BASE_URL      # default: BASE_URL value
TEST_TYPE         # UI or API, default: UI
LOG_LEVEL         # debug|info|warn|error|none, default: info
DEFAULT_TIMEOUT   # ms, default: 30000
SCREENSHOT_ON_FAILURE  # true|false, default: false
```

Always provide a `.env.example` (committed) with placeholder values. Never commit `.env`.

---

## Selector Standards

Priority order (highest to lowest):

1. `getByRole('button', { name: 'Login' })` — role + accessible name
2. `getByLabel('Username')` — form label association
3. `getByText('Submit', { exact: true })` — visible text
4. `getByTestId('login-form')` — test ID attribute
5. `locator('#stable-id')` — stable ID only
6. `locator('[data-cy="element"]')` — data-* attributes
7. **Avoid**: `locator('h2')`, `locator('a.button')`, `locator('.some-class')` — fragile

Never use `.nth()` without an explicit comment justifying why ordinal selection is necessary.

---

## Logging Standards

Use the centralized logger (`import { log } from '../utils/logger'`):

| Level | When to use |
|-------|-------------|
| `log.debug` | Verbose details only needed during debugging |
| `log.info` | Significant test events (navigating, submitting, verifying) |
| `log.warn` | Unexpected state that doesn't fail the test |
| `log.error` | Error conditions — always log before rethrowing |

**Do not** add `log.debug` to every constructor. One `log.info` per meaningful action is sufficient.

---

## TypeScript Standards

- `strict: true` — no exceptions
- No `any` type — use `unknown` with type guards
- No non-null assertions (`!`) on runtime values — use explicit guards
- All async functions return typed Promises
- Interfaces for data shapes, not classes
- Remove dead/unused interface fields immediately

---

## Test Organization

### Feature Files

- Location: `features/`
- Use `Background:` for preconditions shared across all scenarios in a feature
- Tags: `@Smoke` (critical path), `@Regression` (full suite)
- No undefined tags (e.g., `@Sample` with no documented meaning)
- Each scenario tests one specific behavior

### Running Tests

```bash
# Always run bddgen before playwright
npx bddgen && npx playwright test

# Specific scenario
npx bddgen && npx playwright test --grep "Scenario Name"

# Tagged subset
npx bddgen && npx playwright test --grep "@Smoke"
```

---

## CI Configuration

```typescript
// playwright.config.ts — required for CI
workers: process.env.CI ? 2 : undefined,
retries: process.env.CI ? 1 : 0,
```

---

## Code Quality

Pre-commit hooks (Husky + lint-staged) run automatically on staged `.ts` files:
- ESLint with `--fix`
- Prettier format

Run manually:
```bash
npm run lint:fix
npm run format
```

---

## Adding New Capabilities

### New Page Object
1. Create `src/pages/YourPage.ts` extending `BasePage`
2. Define locators in constructor using role/label/text selectors
3. Implement methods returning `Promise<void>`
4. Instantiate directly in step definitions: `new YourPage(page)`

### New API Client
1. Create `src/services/api/YourApiClient.ts` extending `BaseApiClient`
2. Add getter to `ServiceFactory.ts`:
   ```typescript
   public async getYourApiClient(): Promise<YourApiClient> {
     if (!this.serviceInstances.has('yourApiClient')) {
       const client = new YourApiClient();
       await client.init();
       this.serviceInstances.set('yourApiClient', client);
     }
     return this.serviceInstances.get('yourApiClient') as YourApiClient;
   }
   ```
3. ServiceFactory After hook handles cleanup automatically

### New Step Definition File
1. Create `src/steps/yourSteps.ts`
2. Import hooks: `import '../utils/hooks'`
3. Use `const { Given, When, Then } = createBdd<BddContext>()`
4. Check `TEST_TYPE` for dual-mode behavior
5. Run `npx bddgen` to regenerate mappings
