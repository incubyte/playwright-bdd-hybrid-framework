# Playwright BDD Hybrid Framework

A robust end-to-end testing framework built with Playwright and Cucumber BDD, designed for scalable, maintainable, and efficient test automation.

## 📋 Overview

This framework combines the power of Playwright's modern browser automation capabilities with Cucumber's Behavior-Driven Development approach, enabling both technical and non-technical team members to collaborate effectively on test automation.

## 🏗️ Repository Structure

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
│   └── steps/                # Step definitions
│       └── sampleSteps.ts    # Implementation of test steps
├── test-results/             # Test execution artifacts
├── playwright-report/        # HTML test reports
├── package.json              # Project dependencies and scripts
├── playwright.config.ts      # Playwright configuration
└── tsconfig.json             # TypeScript configuration
```

## 🔑 Key Components

### Feature Files (`features/`)

BDD feature files written in Gherkin syntax, describing application behavior from a user's perspective:

```gherkin
Feature: Sample Login
  Scenario: Successful Login
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard
```

### Page Objects (`src/pages/`)

- **BasePage.ts**: Abstract base class with common utilities for all pages:
  - Page loading utilities
  - URL and title verification
  - Screenshot capture
  - Element text verification

- **LoginPage.ts & DashboardPage.ts**: Page-specific classes that extend BasePage:
  - Page element locators
  - Page-specific interactions
  - State verification methods

- **PageFactory.ts**: Implements the Singleton pattern for efficient page object management:
  - Centralized page object creation
  - Page object caching and reuse
  - Lazy initialization

### Step Definitions (`src/steps/`)

Step definition files that implement the Gherkin steps from feature files:
- Connect feature file steps to actual page interactions
- Use PageFactory to efficiently manage page objects
- Implement assertions to verify expected behavior

### Configuration Files

- **playwright.config.ts**: Configures Playwright settings and browser projects
- **tsconfig.json**: TypeScript compiler options
- **package.json**: Project dependencies and NPM scripts

## 🚀 Running Tests

The framework supports multiple ways to run tests:

```bash
# Run all tests in headless mode
npm test

# Run tests with visible browser
npm run test:headed

# Run tests in UI mode for interactive debugging
npm run test:ui

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
```

## 🌟 Key Features and Benefits

### 1. Hybrid Testing Architecture (UI & API)

- **Multi-layer Testing**: Framework supports both UI and API testing with the same BDD scenarios
- **Flexible Execution Modes**: Tests can run in UI-only, API-only, or both modes
- **Shared Scenarios**: Same BDD feature files drive both UI and API tests
- **Comprehensive Coverage**: Validates application functionality at multiple levels

### 2. API Testing Integration

- **API Client Layer**: Structured API client classes for different service endpoints
- **Base API Client**: Core HTTP methods (GET, POST, PUT, DELETE) with automatic initialization
- **Service Factory Pattern**: Centralized management of API client instances
- **Response Handling**: Standardized response parsing and error handling
- **Resource Management**: Proper cleanup with dispose() method to release network resources

### 3. Page Object Model Architecture

- **Separation of Concerns**: Test logic is separated from page interactions
- **Reusability**: Page objects can be reused across multiple test scenarios
- **Maintainability**: UI changes require updates in only one place
- **Readability**: Tests express intent rather than implementation details

### 4. BDD Approach

- **Collaboration**: Features written in business language that all team members understand
- **Living Documentation**: Features serve as both specifications and tests
- **Scenario-Driven**: Tests focus on user scenarios rather than implementation details
- **Early Validation**: Features can be reviewed before implementation begins

### 5. PageFactory Pattern

- **Efficient Resource Management**: Page objects are created once and reused
- **Reduced Duplication**: Centralized creation of page objects
- **Performance Optimization**: Lazy initialization of page objects
- **Consistent State**: All step definitions access the same page instances

### 6. Base Page Inheritance

- **Code Reuse**: Common functionality defined once in BasePage
- **Consistency**: Standard behaviors implemented the same way across pages
- **DRY Principle**: Avoids duplication of common methods
- **Focused Page Objects**: Page classes focus only on their unique functionality

### 7. Multi-Browser Support

- **Cross-Browser Validation**: Tests can run on Chrome, Firefox, and Safari
- **Parallel Execution**: Tests can run simultaneously in different browsers
- **Flexible Configuration**: Easy switching between headed and headless modes
- **Targeted Testing**: Ability to test in specific browsers as needed

### 8. Reporting and Debugging

- **HTML Reports**: Comprehensive test reports with screenshots and traces
- **UI Mode**: Interactive mode for debugging tests
- **Video Recording**: Optional recording of test executions
- **Failure Screenshots**: Automatic capture of screenshots on test failures

## 🔧 Framework Extensions

The framework can be easily extended with:

- Visual regression testing
- Performance testing
- Accessibility testing
- Data-driven testing
- CI/CD integration

## 📊 Best Practices

- Maintain one feature file per major functionality
- Keep step definitions focused and reusable
- Follow the Page Object Model pattern for all UI interactions
- Use the PageFactory for efficient page object management
- Store test data in separate files or environment variables
- Add descriptive assertions for better failure messages

## 🔄 Continuous Integration

This framework is designed to work seamlessly with CI/CD pipelines, supporting:

- GitHub Actions
- Jenkins
- Azure DevOps
- CircleCI
- Travis CI
