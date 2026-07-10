# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Running Tests

```bash
# Generate BDD step definitions and run tests
npm test                    # Run all tests in headless mode
npm run test:headed         # Run with visible browser
npm run test:ui             # Run in interactive UI mode
npm run test:debug          # Run with debug logging enabled

# Browser-specific UI tests
npm run test:ui-chrome      # Run UI tests in Chromium
npm run test:ui-firefox     # Run UI tests in Firefox
npm run test:ui-safari      # Run UI tests in WebKit/Safari
npm run test:ui-all         # Run UI tests across all browsers

# API-only tests
npm run test:api            # Run API tests only

# Parallel execution
npm run test:parallel       # Run UI and API tests in parallel
```

### Code Quality

```bash
npm run lint                # Check code for linting errors
npm run lint:fix            # Auto-fix linting issues
npm run format              # Format code with Prettier
```

**Important**: Pre-commit hooks automatically run linting and formatting. All staged `.ts` and `.tsx` files are linted and formatted before commits.

### Reporting

```bash
npm run report              # View HTML test report
npm run allure:clean        # Clean Allure results
npm run allure:generate     # Generate Allure report
npm run allure:open         # Open Allure report in browser
npm run allure:report       # Generate and open Allure report
npm run test:clean-run      # Clean, test, and report (full cycle)
```

### Single Test Execution

To run a single test scenario, use Playwright's grep functionality:

```bash
# Run specific scenario by name
npx bddgen && npx playwright test --grep "Successful Login"

# Run with specific tag
npx bddgen && npx playwright test --grep "@Smoke"

# Run in specific browser
npx bddgen && npx playwright test --grep "Successful Login" --project=ui-chromium
```

**Note**: Always run `npx bddgen` before Playwright commands to regenerate step definitions from feature files.

## Architecture

### Hybrid BDD Framework

This is a **Playwright + Cucumber BDD hybrid framework** supporting both UI and API testing. The architecture emphasizes:

1. **Direct Page Instantiation**: No PageFactory pattern - pages are instantiated directly with `new LoginPage(page)`
2. **Service Factory Pattern**: API clients are managed via singleton ServiceFactory for resource efficiency
3. **Dual Test Modes**: Tests can run as UI or API based on `TEST_TYPE` environment variable
4. **Automatic Cleanup**: After hooks handle ServiceFactory disposal automatically

### Key Architectural Patterns

#### Page Objects (UI Layer)
- **BasePage** (`src/pages/BasePage.ts`): Abstract base class with common utilities (page loading, verification, navigation)
- **Specific Pages** extend BasePage (e.g., `LoginPage`, `DashboardPage`)
- **Instantiation**: Pages are created directly in step definitions when needed:
  ```typescript
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  ```
- **No Factory Pattern**: Unlike previous versions, this framework uses direct instantiation for simplicity

#### API Clients (API Layer)
- **BaseApiClient** (`src/services/api/BaseApiClient.ts`): Abstract base with HTTP methods (GET, POST, PUT, DELETE)
- **Specific Clients** extend BaseApiClient (e.g., `AuthApiClient`)
- **ServiceFactory** (`src/services/api/ServiceFactory.ts`): Singleton that manages API client instances
- **Automatic Disposal**: ServiceFactory cleans up API contexts in After hooks
- **Usage Pattern**:
  ```typescript
  const serviceFactory = ServiceFactory.getInstance();
  const authClient = await serviceFactory.getAuthApiClient();
  const response = await authClient.loginDemo();
  ```

#### Step Definitions
- Located in `src/steps/` directory
- Import hooks with `import '../utils/hooks'` to ensure registration
- Use `createBdd()` from `playwright-bdd` to get Given/When/Then
- Check `TEST_TYPE` environment variable to determine UI vs API behavior
- Store API state in module-level context objects (e.g., `apiContext`)

#### Test Hooks
- Defined in `src/utils/hooks.ts` using `createBdd(base)` from playwright-bdd
- **Before Hook**: Minimal setup (can add initialization logic here)
- **After Hook**: Critical cleanup including ServiceFactory disposal
- Hooks run automatically for each scenario

#### Logging System
- Centralized logger in `src/utils/logger.ts`
- Configurable log levels: DEBUG, INFO, WARN, ERROR, NONE
- Set via `LOG_LEVEL` environment variable (default: 'info')
- Logger used throughout framework: `import { log } from '../utils/logger'`
- Best practice: Use `log.debug()` for verbose details, `log.info()` for test progress

### Environment Configuration

Tests are configured via environment variables (see `.env` file):

- `TEST_TYPE`: Controls test mode (UI or API)
- `LOG_LEVEL`: Controls logging verbosity (debug, info, warn, error, none)
- `TEST_USERNAME` / `TEST_PASSWORD`: Test credentials
- `BASE_URL`: Base URL for UI tests
- `API_BASE_URL`: Base URL for API tests
- `DEFAULT_TIMEOUT`: Test timeout in milliseconds

The `playwright.config.ts` loads these values and makes them available globally via `process.env`.

### BDD Test Generation

The framework uses `playwright-bdd` which requires a generation step:
- Feature files are in `features/` directory
- Run `npx bddgen` to generate step definition mappings
- The generation happens automatically in all npm test scripts
- Configuration is in `playwright.config.ts` via `defineBddConfig()`

## Critical Implementation Details

### Adding New Page Objects

1. Create class extending `BasePage` in `src/pages/`
2. Define locators as `readonly Locator` properties in constructor
3. Implement page-specific methods
4. Instantiate directly in step definitions: `new YourPage(page)`

### Adding New API Clients

1. Create class extending `BaseApiClient` in `src/services/api/`
2. Implement API-specific methods
3. Add getter method to `ServiceFactory.ts`:
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
4. ServiceFactory automatically handles cleanup

### Adding New Step Definitions

1. Create or modify files in `src/steps/`
2. Import hooks: `import '../utils/hooks'`
3. Create BDD context: `const { Given, When, Then } = createBdd<BddContext>()`
4. Implement steps with TEST_TYPE checks for UI vs API behavior
5. For UI: Instantiate pages directly
6. For API: Use ServiceFactory to get clients
7. Run `npx bddgen` to regenerate mappings

### Dual-Mode Step Implementation

Steps should check `process.env.TEST_TYPE` and implement both UI and API paths:

```typescript
Given('I am on the login page', async ({ page }: BddContext) => {
  const testType = process.env.TEST_TYPE;

  if (testType === 'UI') {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
  }

  if (testType === 'API') {
    // API setup logic
  }
});
```

### Resource Management

**Critical**: The ServiceFactory singleton pattern requires proper cleanup:
- After hook in `hooks.ts` calls `ServiceFactory.getInstance().dispose()`
- This disposes all API contexts and resets the singleton
- Never manually dispose ServiceFactory in step definitions
- Always use `ServiceFactory.getInstance()` to get the factory

### Linting Configuration

- ESLint configuration in `.eslintrc.json`
- Uses `@typescript-eslint` for TypeScript support
- Prettier integration for code formatting
- Pre-commit hooks via Husky enforce code quality
- Run `npm run lint:fix` to auto-fix most issues before committing
