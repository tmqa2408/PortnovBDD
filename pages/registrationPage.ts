import { Page, expect } from "@playwright/test";

export default class RegistrationPage {
  constructor(private readonly page: Page) {}

  async gotoRegisterPage() {
    await this.page.goto(`${process.env.BASE_URL}/register`);
  }

  async registrationFormIsVisible() {
    const form = this.page.locator("(//div[@class='form-fields'])[1]");
    await expect(form).toBeVisible();
  }

  async selectGenderMale() {
    await this.page.getByRole("radio", { name: "Male", exact: true }).check();
  }

  async enterDateOfBirthDay(day: string) {
    await this.page.locator('select[name="DateOfBirthDay"]').selectOption(day);
  }

  async enterDateOfBirthMonth(month: string) {
    await this.page.locator('select[name="DateOfBirthMonth"]').selectOption(month);
  }

  async enterDateOfBirthYear(year: string) {
    await this.page.locator('select[name="DateOfBirthYear"]').selectOption(year);
  }

  async fillFirstAndLastName(firstName: string, lastName: string) {
    await this.page.getByRole("textbox", { name: "First name:" }).fill(firstName);
    await this.page.getByRole("textbox", { name: "Last name:" }).fill(lastName);
  }

  async enterEmail(email: string) {
    await this.page.getByRole("textbox", { name: "Email:" }).fill(email);
  }

  async enterPassword(password: string) {
    await this.page.getByRole("textbox", { name: "Password:", exact: true }).fill(password);
  }

  async enterConfirmPassword(password: string) {
    await this.page.getByRole("textbox", { name: "Confirm password:" }).fill(password);
  }

  async clickRegisterButton() {
    await this.page.getByRole("button", { name: "Register" }).click();
  }

  async checkErrorMessage(expectedText?: string) {
    const error = this.page.locator("//div[@class='message-error validation-summary-errors']//li[1]");
    if (expectedText) {
      await expect(error).toHaveText(expectedText);
    } else {
      await expect(error).toBeVisible();
    }
  }
}
