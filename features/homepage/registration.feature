Feature: User Registration
  As a new user
  I want to register for an account
  So that I can shop and track my orders on the nopCommerce store

  Background:
    Given User is on home page

  @smoke @registration
  Scenario: Successfully navigate to registration page from homepage
    Given I am on the registration page
    Then I should see the registration form

  @smoke @registration
  Scenario: Register with valid mandnatory fields
    Given I am on the registration page
    When I select Male as gender
    Then I enter "John" as first name
    Then I enter "Doe" as last name
    Then I enter "john.doe@example.com" as email
    Then I enter "ValidPass123!" as password
    Then I enter "ValidPass123!" as confirm password
    Then I click on the Register button
