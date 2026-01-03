import { Page } from "@playwright/test";
// import dotenv from "dotenv";
// dotenv.config();
const email = process.env.LOGIN_EMAIL || "";
const password = process.env.LOGIN_PASSWORD || "";
const baseURL = process.env.BASE_URL || "";

export default class LoginPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(`${baseURL}/login`);
  }

  async login(loginEmail: string = email, loginPassword: string = password) {
    await this.page.fill("#Email", loginEmail);
    await this.page.fill("#Password", loginPassword);
    await this.page.click("button[type='submit']");
    // Wait for login to complete
    await this.page.waitForLoadState('networkidle');
  }

  get getTitle() {
    return this.page.title();
  }
}
