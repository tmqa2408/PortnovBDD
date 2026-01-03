import { Page } from "@playwright/test";
// import dotenv from "dotenv";
// dotenv.config();
const email = process.env.EMAIL || "";
const password = process.env.PASSWORD || "";
const baseURL = process.env.BASE_URL || "";

export default class LoginPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(`${baseURL}/login`);
  }

  async login(loginEmail: string = email, loginPassword: string = password) {
    console.log('Filling email:', loginEmail);
    await this.page.fill("#Email", loginEmail);
    console.log('Filling password');
    await this.page.fill("#Password", loginPassword);
    console.log('Clicking submit');
    await this.page.locator("button.button-1.login-button").click();
    // Wait for login to complete
    console.log('Waiting for domcontentloaded');
    await this.page.waitForLoadState('domcontentloaded');
    console.log('DOMContentLoaded reached');
  }

  get getTitle() {
    return this.page.title();
  }
}
