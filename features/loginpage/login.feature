Feature: Login page validation


  @login
  Scenario: Verify login success
    Given I am on the login page
    When I login with valid credentials
    Then verify that the login is success

