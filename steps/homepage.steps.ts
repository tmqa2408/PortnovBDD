import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test"; // ← обязательно
import HomePage from "../pages/homePage";

let homePage: HomePage;

Given("User is on home page", async function () {
  homePage = new HomePage(this.page);
  await homePage.gotoHomePage();
});

When("User should see logo", async function () {
  await expect(homePage.logo).toBeVisible();
});

Then("Shearch button should be valisible", async function () {
  await expect(homePage.searchButton).toBeVisible();
});

Then("User can see a topic block title", async function () {
  const title = await homePage.topicBlockTitle.textContent();
  expect(title).toBe("Welcome to our store");
});

When("User fills {string} in the search field", async function (string) {
  await homePage.searchField.fill(string);
});

Then("click on the Search button", async function () {
  await homePage.searchButton.click();
});
