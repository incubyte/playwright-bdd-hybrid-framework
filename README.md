# Playwright BDD Hybrid Framework

A robust end-to-end testing framework built with Playwright and Cucumber BDD, designed for scalable, maintainable, and efficient test automation.

## 📋 Overview

This framework combines the power of Playwright's modern browser automation capabilities with Cucumber's Behavior-Driven Development approach, enabling both technical and non-technical team members to collaborate effectively on test automation.

## 🌟 Key Features

- **Hybrid Testing**: Combined UI and API testing in a single framework
- **BDD Approach**: Uses Cucumber for behavior-driven development
- **Page Object Model**: Clean separation of test logic and UI interactions
- **Direct Page Instantiation**: Simple and straightforward page object creation
- **Service Factory Pattern**: Efficient resource management for API components
- **Multi-Browser Support**: Tests run on Chrome, Firefox, and Safari
- **Test Hooks**: Flexible before/after hooks for setup and teardown operations
- **Structured Logging**: Configurable logging levels with detailed insights
- **Comprehensive Reporting**: Built-in HTML reporting with screenshots and traces
- **Allure Reporting**: Enhanced reporting with detailed visualizations and analytics
- **Test Organization**: Clear separation between UI and API tests
- **Code Quality Tools**: ESLint and Prettier for consistent code standards
- **Pre-commit Hooks**: Automated linting and formatting before commits


## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-org/playwright-bdd-hybrid-framework.git

# Install dependencies
npm install
```

### Environment Configuration

Create a `.env` file in the root directory with the following structure:

```dotenv
# User Credentials for Test Authentication
TEST_USERNAME=tomsmith
TEST_PASSWORD=SuperSecretPassword!

# Test Environment Configuration
TEST_ENVIRONMENT=staging
TEST_TYPE=UI

# Logging Configuration
LOG_LEVEL=debug

# Execution Settings
HEADLESS=false
DEFAULT_TIMEOUT=30000

# Reporting Settings
SCREENSHOT_ON_FAILURE=true
VIDEO_RECORDING=false
```

### Running Tests

```bash
# Run all tests in headless mode
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in UI mode for interactive debugging
npm run test:ui

# Run tests in debug mode with detailed logging
npm run test:debug

# Run UI tests in specific browsers
npm run test:ui-chrome
npm run test:ui-firefox
npm run test:ui-safari

# Run UI tests in all browsers
npm run test:ui-all

# Run API-only tests
npm run test:api

# Run UI and API tests in parallel
npm run test:parallel

# Clean Allure results and run tests with fresh reporting
npm run test:clean-run

# Run tests with custom log level
LOG_LEVEL=debug npm run test:api
LOG_LEVEL=warn npm run test:ui-chrome
```

### Code Quality

```bash
# Run linting check
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

> **Note**: Pre-commit hooks automatically run linting and formatting on staged files before each commit.





## �🏗️ Architecture Overview

The framework is built with a layered architecture that separates concerns and promotes reusability:

### 1. BDD Layer (Gherkin Features)

Feature files written in Gherkin syntax describe application behavior from a user's perspective.

```gherkin
Feature: Sample Login
  Scenario: Successful Login
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard
```

### 2. Step Definitions Layer

Step definition files connect Gherkin steps to actual implementations using:

- Direct page object instantiation for UI interactions
- Service Factory for API client management
- Custom assertions for verification

### 3. UI Testing Layer (Page Objects)

Page objects provide a clean abstraction over UI elements and interactions:

- **BasePage**: Common utilities and methods shared across all pages
- **LoginPage**: Login page-specific interactions and locators
- **DashboardPage**: Dashboard/secure area page interactions

**Direct Instantiation Pattern:**

```typescript
// Pages are instantiated directly when needed
const loginPage = new LoginPage(page);
await loginPage.goto();
await loginPage.login(username, password);

const dashboardPage = new DashboardPage(page);
await dashboardPage.isPageLoaded();
```

### 4. API Testing Layer (Service Clients)

API clients handle backend service calls:

- **BaseApiClient**: Core HTTP functionality (GET, POST, PUT, DELETE)
- **AuthApiClient**: Authentication-specific API operations
- **ServiceFactory**: Centralized client management with singleton pattern

### 5. Utilities Layer

Cross-cutting concerns that support the entire framework:

- **Logger**: Structured logging system with configurable levels
- **Hooks**: Test lifecycle management for setup and teardown
- **Configuration**: Environment-based configuration management

## 📁 Repository Structure

```
├── features/                 # Cucumber feature files
│   └── login.feature         # Login functionality scenarios
├── src/                      # Source code
│   ├── pages/                # Page Object Model classes
│   │   ├── BasePage.ts       # Base page with common utilities
│   │   ├── LoginPage.ts      # Login page interactions
│   │   └── DashboardPage.ts  # Dashboard/secure area page interactions
│   ├── services/             # API Services
│   │   ├── api/              # API Clients
│   │   │   ├── BaseApiClient.ts    # Base API client with HTTP methods
│   │   │   ├── AuthApiClient.ts    # Authentication API methods
│   │   │   └── ServiceFactory.ts   # Factory for managing API clients
│   │   └── models/           # API Data Models
│   │       └── ApiModels.ts  # Interface definitions for API requests/responses
│   ├── utils/                # Utilities and Helpers
│   │   ├── hooks.ts          # Test lifecycle hooks for setup/teardown
│   │   └── logger.ts         # Configurable logging utility
│   └── steps/                # Step definitions
│       └── sampleSteps.ts    # Implementation of test steps
├── test-results/             # Test execution artifacts
├── playwright-report/        # HTML test reports
├── allure-results/           # Allure test results data
├── allure-report/            # Generated Allure reports
├── package.json              # Project dependencies and scripts
├── playwright.config.ts      # Playwright configuration
└── tsconfig.json             # TypeScript configuration
```

## 🧩 Component Details

### UI Layer: Page Objects

The Page Object Model architecture separates UI interactions from test logic using direct instantiation:

#### BasePage

Abstract base class with common utilities for all pages:

```typescript
// Page loading utilities
async waitForPageLoad() {
    log.debug('Waiting for page to reach networkidle state');
    await this.page.waitForLoadState('networkidle');
    log.debug('Page load completed');
}

// Verification methods
async verifyPageTitle(title: string) {
    log.debug(`Verifying page title matches "${title}"`);
    await expect(this.page).toHaveTitle(new RegExp(title));
    log.debug('Page title verified successfully');
}
```

#### LoginPage & DashboardPage

Specialized page classes that extend BasePage:

```typescript
// LoginPage - handles login page interactions
export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }
}
```

**Usage in Step Definitions:**

```typescript
// Direct instantiation - simple and clear
Given('I am on the login page', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.isPageLoaded();
});
```

### API Layer: Service Clients

The API testing architecture provides a clean, modular approach to service interaction:

#### BaseApiClient

Foundation class for all API operations:

```typescript
async post(url: string, options?: any): Promise<APIResponse> {
    if (!this.apiContext) {
        await this.init();
    }
    log.debug(`POST request to ${url}`, options);
    const response = await this.apiContext.post(url, options);
    log.debug(`POST response from ${url}: status ${response.status()}`);
    return response;
}
```

#### ServiceFactory

Manages API client instances with singleton pattern for efficient resource usage:

```typescript
public async getAuthApiClient(): Promise<AuthApiClient> {
    if (!this.serviceInstances.has('authApiClient')) {
        log.debug('Creating new AuthApiClient instance');
        const client = new AuthApiClient();
        await client.init();
        this.serviceInstances.set('authApiClient', client);
        log.info('AuthApiClient instance created and initialized');
    }
    return this.serviceInstances.get('authApiClient');
}
```

### Test Hooks

The framework implements Before and After hooks for test lifecycle management:

#### Before Hook

Executes before each test scenario for setup operations:

```typescript
Before(async function ({ page }) {
  log.debug('Executing Before hook');
  // Add any setup logic here
});
```

#### After Hook

Executes after each test scenario for cleanup:

```typescript
After(async function ({ page }) {
  log.debug('Executing After hook for cleanup');

  // Clean up Service objects (API clients)
  const serviceFactory = ServiceFactory.getInstance();
  await serviceFactory.dispose();

  log.debug('After hook completed');
});
```

**Benefits of Hooks:**

- Automatic resource cleanup after each test
- Prevents memory leaks
- Ensures test isolation
- Consistent setup and teardown logic

### Logging System

The framework includes a robust logging system for detailed test execution insights:

#### Log Levels

```typescript
export enum LogLevel {
  DEBUG = 1, // Most verbose - detailed debug information
  INFO = 2, // General information about test progress
  WARN = 3, // Warnings that don't fail tests but require attention
  ERROR = 4, // Error conditions that affect test execution
  NONE = 5, // No logging
}
```

#### Configuration Options

The logging level can be configured in multiple ways:

1. **Environment Variable**: Set `LOG_LEVEL` in your environment
2. **Command Line**: Override for specific runs (`LOG_LEVEL=debug npm run test:api`)
3. **.env File**: Default setting in your project's `.env` file
4. **Configuration**: Handled in `playwright.config.ts` with fallback to 'info'

#### Usage Example

```typescript
log.debug('Detailed debugging information');
log.info('General information about test execution');
log.warn('Warning message about potential issues');
log.error('Error occurred during test execution', error);
```

## 📊 Reporting

### HTML Reports

The framework includes built-in HTML reporting for test results:

```bash
# Generate and view HTML report
npm run report
```

Features:

- Test execution timeline
- Pass/fail statistics
- Screenshots on failure
- Trace files for debugging
- Detailed error messages

### Allure Reports

Allure provides enhanced reporting capabilities with rich visualizations:

```bash
# Clean previous Allure results
npm run allure:clean

# Generate Allure report from test results
npm run allure:generate

# Open Allure report in browser
npm run allure:open

# Generate and open Allure report (combined command)
npm run allure:report

# Clean results, run tests, and generate report in one command
npm run test:clean-run
```

**Allure Report Features:**

- Test execution trends over time
- Test categorization by severity and features
- Detailed test case history
- Behavior-driven test organization
- Rich graphs and charts
- Attachment support (screenshots, logs, videos)

## 🔄 Test Execution Flow

### UI Test Flow

1. **Before Hook** - Executes setup operations
2. **Test Scenario Starts** - BDD steps begin execution
3. **Page Instantiation** - Pages created directly as needed
   ```typescript
   const loginPage = new LoginPage(page);
   ```
4. **Test Actions** - Interactions performed via page objects
5. **Assertions** - Verifications using Playwright's expect
6. **After Hook** - Cleanup of API service resources
7. **Test Complete** - Results captured in reports

### API Test Flow

1. **Before Hook** - Executes setup operations
2. **Test Scenario Starts** - BDD steps begin execution
3. **Service Factory** - API client retrieved from factory
   ```typescript
   const serviceFactory = ServiceFactory.getInstance();
   const authClient = await serviceFactory.getAuthApiClient();
   ```
4. **API Calls** - HTTP requests executed
5. **Response Validation** - Status codes and data verified
6. **After Hook** - Cleanup of API contexts
7. **Test Complete** - Results captured in reports

## 🎯 Best Practices

### Page Objects

1. **Direct Instantiation**: Create page objects when needed, no factory overhead
2. **Locator Strategy**: Use Playwright's built-in locator strategies
3. **Reusability**: Common methods in BasePage
4. **Single Responsibility**: Each page object handles one page

### API Testing

1. **Factory Pattern**: Use ServiceFactory for API client management
2. **Resource Cleanup**: Automatic disposal in After hooks
3. **Error Handling**: Graceful error handling with logging
4. **Response Validation**: Type-safe response models

### Logging

1. **Appropriate Levels**: Use correct log level for each message
2. **Contextual Information**: Include relevant details in logs
3. **Performance**: Use DEBUG for verbose logs that can be disabled
4. **Production Runs**: Use INFO or WARN level for CI/CD

### Test Organization

1. **Feature Files**: Group related scenarios
2. **Tags**: Use @Smoke, @Regression for test categorization
3. **Step Reusability**: Write generic, reusable step definitions
4. **Separation of Concerns**: Keep UI and API logic separate

## 🛠️ Troubleshooting

### Common Issues

**Issue: Tests failing due to timeouts**

```bash
# Increase timeout in .env file
DEFAULT_TIMEOUT=60000
```

**Issue: Want to see detailed logs**

```bash
# Run with debug logging
LOG_LEVEL=debug npm run test
```

**Issue: Need to debug specific test**

```bash
# Run in debug mode with UI
npm run test:debug
```

**Issue: API context errors**

- Ensure ServiceFactory cleanup in After hook is working
- Check API_BASE_URL in environment configuration

**Issue: npm install errors or package installation failures (Windows)**

If you encounter permission errors or installation failures, run these commands in **Command Prompt as Administrator**:

```bash
# Remove node_modules and package-lock.json
rmdir /s /q node_modules
del package-lock.json

# Reinstall dependencies
npm install
```


## 📝 Adding New Tests

### Adding a New Page Object

1. Create new page class extending BasePage
2. Define locators in constructor
3. Implement page-specific methods
4. Use direct instantiation in step definitions

```typescript
export class NewPage extends BasePage {
  readonly someElement: Locator;

  constructor(page: Page) {
    super(page);
    this.someElement = page.locator('#element');
  }

  async performAction() {
    await this.someElement.click();
  }
}
```

### Adding New Step Definitions

1. Import required page classes
2. Create page instances directly
3. Implement step logic
4. Add proper logging

```typescript
Given('I am on the new page', async ({ page }) => {
  const newPage = new NewPage(page);
  await newPage.goto();
  log.info('New page loaded');
});
```

### Adding API Tests

1. Create new API client extending BaseApiClient
2. Register in ServiceFactory
3. Use in step definitions
4. Factory handles cleanup automatically

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Playwright team for excellent testing framework
- Cucumber team for BDD support
- Community contributors

---

**Built with ❤️ by the Test Automation Team**
