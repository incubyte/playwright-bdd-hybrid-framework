Feature: Sample Login

  @Sample @Smoke @Regression
  Scenario: Successful Login
    Given I am on the login page
    When I enter valid credentials
    Then I should be redirected to the dashboard