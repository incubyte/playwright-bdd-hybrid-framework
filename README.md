# Playwright BDD Hybrid Framework

A robust end-to-end testing framework built with Playwright and Cucumber BDD, designed for scalable, maintainable, and efficient test automation.

## 📋 Overview

This framework combines the power of Playwright's modern browser automation capabilities with Cucumber's Behavior-Driven Development approach, enabling both technical and non-technical team members to collaborate effectively on test automation.

## 🌟 Key Features

- **Hybrid Testing**: Combined UI and API testing in a single framework
- **BDD Approach**: Uses Cucumber for behavior-driven development
- **Page Object Model**: Clean separation of test logic and UI interactions
- **Factory Patterns**: Efficient resource management for both UI and API components
- **Multi-Browser Support**: Tests run on Chrome, Firefox, and Safari
- **Structured Logging**: Configurable logging levels with detailed insights
- **Comprehensive Reporting**: Built-in HTML reporting with screenshots and traces
- **Allure Reporting**: Enhanced reporting with detailed visualizations and analytics

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

# Run tests in specific browsers
npm run test:chrome
npm run test:firefox
npm run test:safari

# Run tests in all browsers
npm run test:all-browsers

# Run API-only tests
npm run test:api

# Run UI-only tests
npm run test:ui-only

# Run both UI and API tests together
npm run test:both

# Run tests with custom log level
LOG_LEVEL=debug npm run test:api
LOG_LEVEL=warn npm run test:chrome
```

## 🏗️ Architecture Overview

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
- Page objects for UI interactions
- API clients for backend calls
- Custom assertions for verification

### 3. UI Testing Layer (Page Objects)

Page objects provide a clean abstraction over UI elements and interactions:
- **BasePage**: Common utilities and methods
- **Specialized Pages**: Specific page interactions
- **PageFactory**: Efficient page object management

### 4. API Testing Layer (Service Clients)

API clients handle backend service calls:
- **BaseApiClient**: Core HTTP functionality
- **Specialized Clients**: Domain-specific API operations
- **ServiceFactory**: Centralized client management

### 5. Utilities Layer

Cross-cutting concerns that support the entire framework:
- **Logger**: Structured logging system
- **Configuration**: Environment-based configuration

## 📁 Repository Structure

```
├── features/                 # Cucumber feature files
│   └── login.feature         # Login functionality scenarios
├── src/                      # Source code
│   ├── pages/                # Page Object Model classes
│   │   ├── BasePage.ts       # Base page with common utilities
│   │   ├── DashboardPage.ts  # Dashboard/secure area page interactions
│   │   ├── LoginPage.ts      # Login page interactions
│   │   └── PageFactory.ts    # Factory for managing page objects
│   ├── services/             # API Services
│   │   ├── api/              # API Clients
│   │   │   ├── AuthApiClient.ts    # Authentication API methods
│   │   │   ├── BaseApiClient.ts    # Base API client with HTTP methods
│   │   │   └── ServiceFactory.ts   # Factory for managing API clients
│   │   └── models/           # API Data Models
│   │       └── ApiModels.ts  # Interface definitions for API requests/responses
│   ├── utils/                # Utilities and Helpers
│   │   └── logger.ts         # Configurable logging utility
│   └── steps/                # Step definitions
│       └── sampleSteps.ts    # Implementation of test steps
├── test-results/             # Test execution artifacts
├── playwright-report/        # HTML test reports
├── package.json              # Project dependencies and scripts
├── playwright.config.ts      # Playwright configuration
└── tsconfig.json             # TypeScript configuration
```

## 🧩 Component Details

### UI Layer: Page Objects

The Page Object Model architecture separates UI interactions from test logic:

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

#### PageFactory

Manages page object creation and lifecycle:
```typescript
public getLoginPage(): LoginPage {
    if (!this.pageInstances.has('loginPage')) {
        log.debug('Creating new LoginPage instance');
        this.pageInstances.set('loginPage', new LoginPage(this.page));
    } else {
        log.debug('Returning cached LoginPage instance');
    }
    return this.pageInstances.get('loginPage');
}
```

### API Layer: Service Clients

The API testing architecture provides a clean, modular approach to service interaction:

#### BaseApiClient

Foundation class for all API operations:
```typescript
async post(url: string, options?: any): Promise<APIResponse> {
    if (!this.apiContext) {
        log.debug('API context not initialized for POST request, initializing now');
        await this.init();
    }
    log.debug(`POST request to ${url}`, options);
    const response = await this.apiContext.post(url, options);
    log.debug(`POST response from ${url}: status ${response.status()}`);
    return response;
}
```

#### ServiceFactory

Manages API client instances:
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

### Logging System

The framework includes a robust logging system for detailed test execution insights:

#### Log Levels

```typescript
export enum LogLevel {
  DEBUG = 1,    // Most verbose - detailed debug information
  INFO = 2,     // General information about test progress
  WARN = 3,     // Warnings that don't fail tests but require attention
  ERROR = 4,    // Error conditions that affect test execution
  NONE = 5      // No logging
}
```

#### Configuration Options

The logging level can be configured in multiple ways:
1. **Environment Variable**: Set `LOG_LEVEL` in your environment
2. **Command Line**: Override for specific runs (`LOG_LEVEL=debug npm run test:api`)
3. **.env File**: Default setting in your project's `.env` file
4. **Configuration**: Handled in `playwright.config.ts` with fallback to 'info'

## 📊 Reporting

### HTML Reports

The framework includes built-in HTML reporting for test results:

```bash
# Generate and view HTML report
npm run report
```

### Allure Reports

Allure provides enhanced reporting capabilities with rich visualizations:

```bash
# Generate Allure report from test results
npm run allure:generate

# Open Allure report in browser
npm run allure:open

# Generate and open Allure report (combined command)
npm run allure:report
```

#### Allure Report Features

The Allure reporting system offers several advantages:

- **Interactive Dashboard**: Overview of test execution with pass/fail statistics
- **Detailed Test Cases**: Step-by-step test execution with screenshots and traces
- **Timeline View**: Chronological representation of test execution
- **Categorized Failures**: Group failures by type for easier troubleshooting
- **Environment Details**: Capture test environment information
- **Attachments**: View screenshots, videos, and logs directly in the report
- **BDD Integration**: Cucumber steps are properly displayed in the report hierarchy

## 🔄 Continuous Integration

This framework is designed to work seamlessly with CI/CD pipelines, supporting:

- GitHub Actions
- Jenkins
- Azure DevOps
- CircleCI
- Travis CI

## 🔧 Framework Extensions

The framework can be easily extended with:

- Visual regression testing
- Performance testing
- Accessibility testing
- Data-driven testing
