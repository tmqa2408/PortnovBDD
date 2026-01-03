import { Page, expect } from "@playwright/test";
import { baseURL } from "../corlib/basepage";

export default class WishlistPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(`${baseURL}/wishlist`);
    await this.page.waitForLoadState('networkidle');
  }

  async navigateFromHeader() {
    const wishlistLink = this.page.locator('a:has-text("Wishlist")').first();
    await wishlistLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getWishlistCount(): Promise<number> {
    try {
      const wishlistLink = this.page.locator('a:has-text("Wishlist")').first();
      const wishlistText = await wishlistLink.textContent();
      if (!wishlistText) return 0;
      
      const match = wishlistText.match(/\((\d+)\)/);
      return match ? parseInt(match[1], 10) : 0;
    } catch (e) {
      console.error('Error getting wishlist count:', e);
      return 0;
    }
  }

  async isWishlistPage(): Promise<boolean> {
    try {
      await this.page.waitForURL('**/wishlist', { timeout: 10000 });
      return this.page.url().includes('/wishlist');
    } catch (e) {
      return false;
    }
  }

  async verifyPageTitle(): Promise<string> {
    await this.page.waitForSelector('h1', { timeout: 10000 });
    const title = await this.page.title();
    expect(title).toContain('Wishlist');
    return title;
  }

  async isWishlistEmpty(): Promise<boolean> {
    const emptyMessage = this.page.locator('text=The wishlist is empty!');
    return await emptyMessage.isVisible({ timeout: 5000 });
  }

  async getWishlistItems(): Promise<string[]> {
    const items = [];
    const itemElements = await this.page.$$('.wishlist-content tbody tr:not(.cart-footer-row)');
    
    for (const item of itemElements) {
      const text = await item.textContent();
      if (text) items.push(text.trim());
    }
    
    return items;
  }
}
