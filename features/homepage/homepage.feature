Feature: To test home page

  Scenario: I validate elements on home page
    Given User is on home page
    Then User can see a topic block title


  Scenario:  Verify Shearch functionality 
    Given User is on home page
    Then Search button should be visible
    When User fills "Test" in the search field
    Then click on the Search button



