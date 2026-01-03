import { Given, When, Then } from "@cucumber/cucumber";
import LoginPage from "../pages/loginPage";
import { expect } from "@playwright/test";

const baseURL = process.env.BASE_URL;

let loginPage: LoginPage;

Given('I am on the login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.open();
});

When('I login with valid credentials', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.login(); // Uses default credentials from .env
});

Then('verify that the login is success', async function () {
  await this.page.waitForSelector('a:has-text("Log out")', { timeout: 10000 });
});

// Additional steps that might be useful for other scenarios
When('I login with email {string} and password {string}', async function (email: string, pwd: string) {
  loginPage = new LoginPage(this.page);
  await loginPage.login(email, pwd);
});

Then('I should see an error message {string}', async function (errorMessage: string) {
  await this.page.waitForSelector('.message-error', { timeout: 10000 });
  const errorText = await this.page.textContent('.message-error');
  expect(errorText).toContain(errorMessage);
});

