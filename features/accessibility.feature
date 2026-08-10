Feature: Accessibility Testing

  Scenario: Check accessibility on the login page
    Given I am on the login page
    Then I check for accessibility violations

  Scenario: Check accessibility with specific tags
    Given I am on the login page
    Then I check for accessibility violations with tags "wcag2a, wcag2aa"

  Scenario: Check accessibility excluding elements
    Given I am on the login page
    # Example: excluding a specific element if known to cause issues or not relevant
    # Then I check for accessibility violations excluding "#some-element"

  Scenario: Check accessibility on the login form
    Given I am on the login page
    Then I check for accessibility violations on the ".login-form"
