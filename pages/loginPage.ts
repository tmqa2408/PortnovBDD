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

  async goto() {
    await this.open();
  }

  async login(loginEmail: string = email, loginPassword: string = password): Promise<boolean> {
    await this.page.fill("#Email", loginEmail);
    await this.page.fill("#Password", loginPassword);
    await this.page.locator('button.button-1.login-button').click();
    // Wait for login to complete
    await this.page.waitForLoadState('domcontentloaded');
    // Check if login was successful
    const logoutLink = this.page.locator('a[href="/logout"]');
    return await logoutLink.isVisible({ timeout: 5000 });
  }

  get getTitle() {
    return this.page.title();
  }
}
