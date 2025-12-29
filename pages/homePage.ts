import { Page } from "@playwright/test";
import { baseURL } from "../corlib/basepage";

export default class HomePage {
  constructor(private page: Page) {}

  async gotoHomePage() {
    if (!baseURL) throw new Error("BASE_URL is not defined");
    await this.page.goto(baseURL);
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
    return this.page.locator("//h2[contains(text(), 'Welcome too our store')]");
  }
}

