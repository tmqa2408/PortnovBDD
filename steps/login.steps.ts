import { Given, When, Then } from "@cucumber/cucumber";
import LoginPage from "../pages/loginPage";
import { expect } from "@playwright/test";

let loginPage: LoginPage;

Given('I am on the login page', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.open();
});


When('I login with valid credentials', async function () {
  loginPage = new LoginPage(this.page);
  await loginPage.login("user@example.com", "Password123!");
});

Then('verify that the login is success', async function () {
  // ждём, пока URL изменится или появится элемент "My Account"
  await this.page.waitForSelector('text=My Account', { timeout: 5000 });
  const accountText = await this.page.textContent('text=My Account');
  expect(accountText).toContain("My account");
});

