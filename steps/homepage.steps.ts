import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import HomePage from "../pages/homePage";

let homePage: HomePage;

Given("User is on home page", async function () {
  homePage = new HomePage(this.page);
  await homePage.goto();
  await homePage.waitForPageLoad();
});

When("User should see logo", async function () {
  await expect(homePage.logo).toBeVisible({ timeout: 10000 });
});

Then("Search button should be visible", async function () {
  await expect(homePage.searchButton).toBeVisible({ timeout: 10000 });
});

Then("User can see a topic block title", async function () {
  const title = await homePage.topicBlockTitle.textContent({ timeout: 10000 });
  expect(title).toContain("Welcome to our store");
});

When("User fills {string} in the search field", async function (searchTerm: string) {
  await homePage.searchField.fill(searchTerm);
});

Then("click on the Search button", async function () {
  await homePage.searchButton.click();
  await this.page.waitForLoadState('networkidle');
});
