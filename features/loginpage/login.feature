Feature: Login page validation

  Scenario: Verify login success
    Given I am on the login page
    When I login with valid credentials
    Then verify that the login is success

