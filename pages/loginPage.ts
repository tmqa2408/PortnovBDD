import { Page } from "@playwright/test";
import { baseURL } from "../corlib/basepage";

export default class LoginPage {
  constructor(private page: Page) {}

  async open() {
    if (!baseURL) throw new Error("BASE_URL is not defined");
    await this.page.goto(`${baseURL}/login`);
  }

  async login(email: string, password: string) {
    await this.page.fill("#Email", email);
    await this.page.fill("#Password", password);
    await this.page.click("button[type='submit']");
  }

  async getTitle() {
    return await this.page.title();
  }
}
