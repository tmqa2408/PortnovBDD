import { Given, When, Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import WishlistPage from "../pages/wishlistPage";
import LoginPage from "../pages/loginPage";
import { baseURL } from "../corlib/basepage";

let wishlistPage: WishlistPage;
let loginPage: LoginPage;

// Background step
Given('I am on the nopCommerce homepage', async function () {
  await this.page.goto(process.env.BASE_URL as string);
  wishlistPage = new WishlistPage(this.page);
  await this.page.waitForLoadState('networkidle');
});

// Common steps
Given('I am not logged in', async function () {
  try {
    const logoutLink = this.page.locator('a=Log out');
    if (await logoutLink.isVisible({ timeout: 2000 })) {
      await logoutLink.click();
      await this.page.waitForLoadState('networkidle');
    }
  } catch (e) {
    // User is already logged out
  }
});

Given('I am logged in', async function () {
  const loginPage = new LoginPage(this.page);
  
  
  try {
    // First, check if already logged in by looking for logout link
    const logoutLink = this.page.locator('a', { hasText: 'Log out' });
    if (await logoutLink.isVisible({ timeout: 2000 })) {
      console.log('User is already logged in');
      return; // Already logged in
    }
    
    // If not logged in, proceed with login
    console.log('Attempting to log in...');
    await loginPage.open();
    await loginPage.login(); // Uses default credentials from .env
    
    // Verify login was successful
    await this.page.waitForSelector('text=My Account', { timeout: 10000 });
    const accountText = await this.page.textContent('text=My Account');
    expect(accountText).toContain("My account");
    console.log('Login successful');
    
    // Initialize wishlist page
    wishlistPage = new WishlistPage(this.page);
    
  } catch (error) {
    console.error('Login error:', error);
    // Take a screenshot on error
    await this.page.screenshot({ path: `screenshots/login-error-${Date.now()}.png` });
    throw error;
  }
});

// Action steps
When('I click on the {string} link in the header', async function (linkText: string) {
  const link = this.page.locator(`a:has-text("${linkText}")`).first();
  await link.click();
  await this.page.waitForLoadState('networkidle');
});

// Verification steps
Then('I should be redirected to the wishlist page', async function () {
  await this.page.waitForURL('**/wishlist', { timeout: 10000 });
  expect(this.page.url()).toContain('/wishlist');
});

Then('the wishlist page URL should contain {string}', async function (urlPart: string) {
  expect(this.page.url()).toContain(urlPart);
});

Then('I should see the wishlist page', async function () {
  // Wait for the wishlist page to load
  await this.page.waitForSelector('h1', { timeout: 15000, state: 'visible' });
  
  // Verify page title
  const title = await this.page.title();
  expect(title).toContain('Wishlist');
  
  try {
    // Check for empty wishlist message or wishlist content
    const emptyWishlist = this.page.locator('.no-data');
    const wishlistContent = this.page.locator('.wishlist-content');
    
    const isEmpty = await emptyWishlist.isVisible({ timeout: 5000 }).catch(() => false);
    const hasContent = await wishlistContent.isVisible({ timeout: 5000 }).catch(() => false);
    
    // At least one of them should be visible
    if (!isEmpty && !hasContent) {
      throw new Error('Wishlist page content not found');
    }
    
    if (isEmpty) {
      console.log('Wishlist is currently empty');
    } else {
      console.log('Wishlist content is displayed');
    }
  } catch (error) {
    console.error('Error verifying wishlist page:', error);
    throw error;
  }
});

Then('I should see my wishlist items if any exist', async function () {
  try {
    // Wait for either empty message or wishlist items
    await Promise.race([
      this.page.waitForSelector('.no-data', { timeout: 10000 }),
      this.page.waitForSelector('.wishlist-content', { timeout: 10000 })
    ]);
    
    // Check if wishlist is empty or has items
    const emptyWishlist = this.page.locator('.no-data');
    const wishlistItems = this.page.locator('.wishlist-content tbody tr:not(.cart-footer-row)');
    
    if (await emptyWishlist.isVisible({ timeout: 2000 }).catch(() => false)) {
      console.log('Wishlist is empty');
    } else {
      const itemCount = await wishlistItems.count();
      console.log(`Wishlist has ${itemCount} items`);
      expect(itemCount).toBeGreaterThan(0);
    }
  } catch (error) {
    console.error('Error checking wishlist items:', error);
    throw error;
  }
});
