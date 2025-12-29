import { Given, When, Then } from "@cucumber/cucumber";
import RegistrationPage from "../pages/registrationPage";
import { expect } from "@playwright/test";

let registrationPage: RegistrationPage;

Given("I am on the registration page", async function () {
  // Используем this.page из CustomWorld
  registrationPage = new RegistrationPage(this.page);
  await registrationPage.gotoRegisterPage();
});

When("I select Male as gender", async function () {
  await registrationPage.selectGenderMale();
});

When("I enter {string} as first name", async function (firstName: string) {
  await registrationPage.fillFirstAndLastName(firstName, "Doe");
});

When("I enter {string} as last name", async function (lastName: string) {
  await registrationPage.fillFirstAndLastName(lastName, "John");
});

When("I enter {string} as email", async function (email: string) {
  await registrationPage.enterEmail(email);
});

When("I enter {string} as password", async function (password: string) {
  await registrationPage.enterPassword(password);
});

When("I enter {string} as confirm password", async function (password: string) {
  await registrationPage.enterConfirmPassword(password);
});

When("I click on the Register button", async function () {
  await registrationPage.clickRegisterButton();
});

Then("I should see error message", async function (expectedText: string) {
  await registrationPage.checkErrorMessage(expectedText);
});

Then("I should see the registration form", async function () {
  await registrationPage.registrationFormIsVisible();
});
