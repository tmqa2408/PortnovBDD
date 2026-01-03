import { Page } from "@playwright/test";
import { baseURL } from "../corlib/basepage";

export default class HomePage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto(baseURL);
    await this.page.waitForLoadState('networkidle');
  }

  get logo() {
    return this.page.getByRole("img", { name: "Logo" });
  }

  get searchButton() {
    return this.page.getByRole("button", { name: "Search" });
  }

  get searchField() {
    return this.page.getByRole("textbox", { name: "Search store" });
  }

  get topicBlockTitle() {
    // More reliable selector that looks for the welcome message
    return this.page.locator(".topic-block-title h2");
  }

  async waitForPageLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('.topic-block-title h2', { state: 'visible', timeout: 10000 });
  }
}
