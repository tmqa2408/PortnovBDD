Feature: Wishlist Management
  As a customer
  I want to access and manage my wishlist
  So that I can save items I'm interested in purchasing later

  Background:
    Given I am on the nopCommerce homepage
  @smoke @wishlist
  Scenario: Navigate to wishlist from homepage when not logged in
    Given I am not logged in
    When I click on the "Wishlist (0)" link in the header
    Then I should be redirected to the wishlist page
    And the wishlist page URL should contain "/wishlist"
    And I should see the wishlist page
  @smoke @wishlist
  Scenario: Navigate to wishlist from homepage when logged in
    Given I am logged in
    When I click on the "Wishlist" link in the header
    Then I should be redirected to the wishlist page
  #   And I should see my wishlist items if any exist
  @wishlist @ui
  Scenario: Verify wishlist item count displays correctly when empty
    Given I am not logged in
    And I have no items in my wishlist
    When I view the homepage header
    Then I should see "Wishlist (0)" displayed
    And the count should be "0"
  @wishlist @functionality
  Scenario: Add product to wishlist from homepage featured products (not logged in)
    Given I am not logged in
    And I am on the homepage
    And my wishlist is empty
    When I click "Add to wishlist" button for "Build your own computer"
    Then the product should be added to my wishlist
    And the wishlist count should increase by 1

  @wishlist @functionality
  Scenario: Add product to wishlist from homepage when logged in
    Given I am logged in
    And I am on the homepage
    And my wishlist is empty
    When I click "Add to wishlist" button for "Apple MacBook Pro 13-inch"
    Then the product should be added to my wishlist
    And the wishlist count should increase by 2

  @wishlist @functionality
  Scenario: View empty wishlist page
    Given I am logged in
    And my wishlist is empty
    When I navigate to the wishlist page
    Then I should see a message "The wishlist is empty" or similar
    And I should see a link to continue shopping
    And no products should be displayed

  @wishlist @functionality
  Scenario: View wishlist with multiple items
    Given I am logged in
    And my wishlist is empty
    And I have the following items in my wishlist:
      | Product Name                  | Price     |
      | Build your own computer       | $1,200.00 |
      | Apple MacBook Pro 13-inch     | $1,800.00 |
    When I navigate to the wishlist page
    Then I should see all 2 items displayed
    And each item should show its name, price, and image
    And the wishlist should have 2 items

  @wishlist @functionality
  Scenario: Add item to cart from wishlist
  Given I am logged in
  And my wishlist is empty    
  And "Apple MacBook Pro 13-inch" is in my wishlist  
  When I navigate to the wishlist page
  And I click "Add to cart" for "Apple MacBook Pro 13-inch"
  Then the item should be added to my shopping cart

  # ------------------------------------

  # Scenario: Remove item from wishlist
  #   Given I am logged in
  #   And "Build your own computer" is in my wishlist
  #   When I navigate to the wishlist page
  #   And I click the remove/delete button for "Build your own computer"
  #   Then the item should be removed from my wishlist
  #   And the wishlist count should decrease by 1
  #   And I should see a confirmation or the item should disappear
  # @wishlist @functionality
  # Scenario: Wishlist persists across sessions
  #   Given I am logged in
  #   And I add "HTC One M8" to my wishlist
  #   When I log out
  #   And I close the browser
  #   And I reopen the browser
  #   And I log in again
  #   And I navigate to the wishlist page
  #   Then "HTC One M8" should still be in my wishlist
  # @wishlist @functionality
  # Scenario: Guest user wishlist does not persist after login
  #   Given I am not logged in
  #   And I add items to wishlist as a guest (if allowed)
  #   When I login to my account
  #   Then the guest wishlist should be cleared or merged based on system behavior
  #   And only my account's wishlist items should be displayed
  # @wishlist @ui
  # Scenario: Wishlist link styling changes based on login state
  #   Given I am not logged in
  #   When I view the wishlist link in header
  #   Then it should display as "Wishlist (0)"
  #   When I log in as a user with 3 wishlist items
  #   Then it should display as "Wishlist (3)"
  #   And the styling should be consistent
  # @wishlist @navigation
  # Scenario: Navigate to product detail page from wishlist
  #   Given I am logged in
  #   And "Apple MacBook Pro 13-inch" is in my wishlist
  #   When I navigate to the wishlist page
  #   And I click on the product name or image
  #   Then I should be redirected to the product detail page
  #   And the product details should be displayed
  # @wishlist @functionality
  # Scenario: Update product quantity in wishlist (if applicable)
  #   Given I am logged in
  #   And "Build your own computer" is in my wishlist
  #   When I navigate to the wishlist page
  #   And I update the quantity to "2" for "Build your own computer"
  #   Then the quantity should be updated
  #   And the change should be saved
