Feature: Wishlist Functionality
  As a user
  I want to access and manage my wishlist
  So that I can save items I'm interested in purchasing later

  Background:
    Given I am on the nopCommerce homepage

  # @smoke @wishlist
  # Scenario: Navigate to wishlist from homepage when not logged in
  #   Given I am not logged in
  #   When I click on the "Wishlist (0)" link in the header
  #   Then I should be redirected to the wishlist page
  #   And the wishlist page URL should contain "/wishlist"
  #   And I should see the wishlist page

  @smoke @wishlist
  Scenario: Navigate to wishlist from homepage when logged in
    Given I am logged in
    When I click on the "Wishlist" link in the header
    Then I should be redirected to the wishlist page
    And I should see my wishlist items if any exist