import { Page, expect } from "@playwright/test";
import { baseURL } from "../corlib/basepage";
import HomePage from "./homePage";

export default class WishlistPage {
  constructor(private page: Page) {}

  async open() {
    await this.page.goto(`${baseURL}/wishlist`);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async goto() {
    await this.open();
  }

  async navigateFromHeader() {
    const wishlistLink = this.page.locator('a:has-text("Wishlist")').first();
    await wishlistLink.click();
    await this.page.waitForLoadState('domcontentloaded');
  }

  get wishlistLink() {
    return this.page.locator('a').filter({ hasText: /wishlist/i }).first();
  }

  async getWishlistCount(): Promise<number> {
    try {
      const wishlistLink = this.page.locator('a').filter({ hasText: /wishlist/i }).first();
      const wishlistText = await wishlistLink.textContent();
      const linkHTML = await wishlistLink.evaluate(el => el.outerHTML);
      if (!wishlistText) return 0;
      
      // Check if text contains a number in parentheses
      const match = wishlistText.match(/\((\d+)\)/);
      if (match) {
        const count = parseInt(match[1], 10);
        return count;
      }
      
      // If no count in text, check if there are actually items in wishlist
      const items = await this.getWishlistItems();
      return items.length;
      
    } catch (e) {
      console.error('Error getting wishlist count:', e);
      return 0;
    }
  }

  async getCartCount(): Promise<number> {
    try {
      // Try different selectors for cart link
      const cartSelectors = [
        'a[href*="cart"]',
        'a[href*="shopping-cart"]',
        'a:has-text("Shopping cart")',
        'a:has-text("Cart")',
        '.cart-link',
        '#topcartlink',
        'a.ico-cart'
      ];
      
      for (const selector of cartSelectors) {
        try {
          const cartLink = this.page.locator(selector).first();
          const isVisible = await cartLink.isVisible({ timeout: 2000 });
          if (isVisible) {
            const cartText = await cartLink.textContent();
            if (!cartText) continue;
            
            // Check if text contains a number in parentheses
            const match = cartText.match(/\((\d+)\)/);
            if (match) {
              const count = parseInt(match[1], 10);
              return count;
            }
          }
        } catch (e) {
          // Continue to next selector
        }
      }
      
      return 0;
    } catch (e) {
      console.error('Error getting cart count:', e);
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
    try {
      // Check for empty message
      const emptyMessage = this.page.locator('text=The wishlist is empty!');
      if (await emptyMessage.isVisible({ timeout: 2000 })) {
        return true;
      }

      // Alternative empty messages
      const alternativeMessages = [
        'text=Your wishlist is empty',
        'text=The wishlist is empty',
        'text=No items in your wishlist'
      ];

      for (const message of alternativeMessages) {
        const locator = this.page.locator(message);
        if (await locator.isVisible({ timeout: 1000 })) {
          return true;
        }
      }

      // Check if there are no items in the table
      const items = await this.getWishlistItems();
      return items.length === 0;
    } catch (e) {
      return false;
    }
  }

  get emptyWishlistMessage() {
    return this.page.locator('text=The wishlist is empty!');
  }

  get continueShoppingLink() {
    return this.page.locator('a:has-text("Continue shopping")');
  }

  get successNotification() {
    return this.page.locator('.success-notification, .alert-success, .bar-notification, .alert, .notification, .message');
  }

  async waitForWishlistToLoad() {
    await this.page.waitForLoadState('networkidle');
    await this.page.waitForSelector('h1, .wishlist-content', { timeout: 10000 });
  }

  async clearWishlist() {
    try {
      // First check if there are any items
      const items = await this.getWishlistItems();
      
      if (items.length === 0) {
        return; // Already empty
      }

      // Remove items one by one
      await this.removeAllItemsIndividually();
      
      // Verify wishlist is now empty
      const remainingItems = await this.getWishlistItems();
      
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      throw error;
    }
  }

  async removeAllItemsIndividually() {
    try {
      // Get all product names and remove them one by one
      const items = await this.getWishlistItems();
      
      for (const item of items) {
        await this.removeItemFromWishlist(item.name);
        await this.page.waitForTimeout(1000); // Wait longer between removals
      }
      
    } catch (error) {
      console.error('Error removing items individually:', error);
      throw error;
    }
  }

  async addProductToWishlist(productName: string) {
    try {
      // Navigate directly to product page
      const productSlug = productName.toLowerCase().replace(/\s+/g, '-');
      const productUrl = `${baseURL}/${productSlug}`;
      await this.page.goto(productUrl, { timeout: 60000 });
      await this.page.waitForLoadState('domcontentloaded');
      
      // Wait for the product page to load
      await this.page.waitForSelector('#product-details-form', { timeout: 10000 });
      
      // Set quantity
      const minQuantity = productName === "Apple MacBook Pro 13-inch" ? 2 : 1;
      try {
        const quantityInput = this.page.locator('#product-details-form input[name*="Quantity"], #product-details-form input[type="number"]').first();
        await quantityInput.fill(minQuantity.toString());
      } catch (e) {
        // Could not set quantity, perhaps not needed
      }
      
      // Select product attributes if any
      const selects = this.page.locator('#product-details-form select');
      const selectCount = await selects.count();
      for (let i = 0; i < selectCount; i++) {
        const select = selects.nth(i);
        if (await select.isVisible()) {
          const options = select.locator('option');
          const optionCount = await options.count();
          if (optionCount > 1) {
            await select.selectOption({ index: optionCount - 1 });
          }
        }
      }
      
      // Check radios if any
      const radios = this.page.locator('#product-details-form input[type="radio"]');
      const radioCount = await radios.count();
      for (let i = 0; i < radioCount; i++) {
        const radio = radios.nth(i);
        if (await radio.isVisible()) {
          const isChecked = await radio.isChecked();
          if (!isChecked) {
            await radio.check();
          }
        }
      }
      
      // Check checkboxes if any
      const checkboxes = this.page.locator('#product-details-form input[type="checkbox"]');
      const checkboxCount = await checkboxes.count();
      for (let i = 0; i < checkboxCount; i++) {
        const checkbox = checkboxes.nth(i);
        if (await checkbox.isVisible()) {
          const isChecked = await checkbox.isChecked();
          if (!isChecked) {
            await checkbox.check();
          }
        }
      }
      
      // Click the main "Add to wishlist" button on the product page
      const wishlistButton = this.page.locator('#product-details-form button.add-to-wishlist-button, input[value="Add to wishlist"]').first();
      // Log the button's HTML
      const buttonHTML = await wishlistButton.evaluate(el => el.outerHTML);
      
      // Wait for button to be enabled
      await this.page.waitForFunction(() => {
        const button = document.querySelector('#product-details-form button.add-to-wishlist-button, #product-details-form input[value="Add to wishlist"]');
        return button && !(button as HTMLButtonElement | HTMLInputElement).disabled;
      });
      
      await wishlistButton.click({ timeout: 5000 });
      
      // Wait for the wishlist count to update or page to stabilize
      await this.page.waitForLoadState('networkidle');
      
      // Log the count after click
      const countAfterClick = await this.getWishlistCount();
      
      await this.page.waitForLoadState('domcontentloaded');
      
      // Wait for success notification or check if item was added
      try {
        const successNotification = this.page.locator('.success-notification, .alert-success, .notification-success');
        await successNotification.waitFor({ timeout: 3000 });
      } catch (e) {
        // No success notification found
      }
      
    } catch (error) {
      console.error(`Error adding ${productName} to wishlist:`, error);
      throw error;
    }
  }

  async verifyProductInWishlist(productName: string): Promise<boolean> {
    // First check if wishlist content exists
    const wishlistContent = this.page.locator('.wishlist-content');
    const contentExists = await wishlistContent.isVisible({ timeout: 2000 });
    if (!contentExists) {
      return false;
    }
    // Look specifically within the wishlist table to avoid conflicts with other elements
    const productLocator = wishlistContent.locator(`text=${productName}`);
    try {
      const isVisible = await productLocator.isVisible({ timeout: 3000 });
      return isVisible;
    } catch (e) {
      return false;
    }
  }

  async addItemToCart(productName: string) {
    const cartCountBefore = await this.getCartCount();
    
    // Find the row containing the product
    const productRow = this.page.locator('tr').filter({ hasText: productName });
    const rowCount = await productRow.count();
    if (rowCount === 0) {
      throw new Error(`Product row not found for ${productName}`);
    }
    
    // Check the add to cart checkbox in the product row
    const addToCartCheckbox = productRow.locator('input[name="addtocart"]');
    await addToCartCheckbox.waitFor({ state: 'visible', timeout: 5000 });
    await addToCartCheckbox.check();
    const isChecked = await addToCartCheckbox.isChecked();
    
    // Click the add to cart button
    const addToCartButton = this.page.locator('button:has-text("Add to cart")');
    const buttonCount = await addToCartButton.count();
    if (buttonCount > 0) {
      await addToCartButton.first().waitFor({ state: 'visible' });
      const isEnabled = await addToCartButton.first().isEnabled();
      if (isEnabled) {
        await addToCartButton.first().click();
      } else {
        throw new Error('Add to cart button is not enabled');
      }
    } else {
      throw new Error('Add to cart button not found');
    }
    await this.page.waitForLoadState('networkidle');
    
    const cartCountAfter = await this.getCartCount();
    
    // Wait for cart count to increase
    if (cartCountAfter <= cartCountBefore) {
      await this.page.waitForTimeout(2000);
      const finalCartCount = await this.getCartCount();
      return finalCartCount > cartCountBefore;
    }
    
    return cartCountAfter > cartCountBefore;
  }

  async removeItemFromWishlist(productName: string) {
    try {
      // Find all wishlist rows and identify the correct one
      const itemRows = await this.page.$$('.wishlist-content tbody tr:not(.cart-footer-row)');
      
      for (let i = 0; i < itemRows.length; i++) {
        const row = itemRows[i];
        
        // Get the product name from TD 3
        const tds = await row.$$('td');
        let name = '';
        if (tds.length >= 4) {
          const productNameCell = tds[3];
          const link = await productNameCell.$('a');
          if (link) {
            name = await link.textContent() || '';
          } else {
            name = await productNameCell.textContent() || '';
          }
        }
        
        if (name.trim() === productName) {
          // First try to find a remove link/button in the row
          let removeLink = await row.$('a:has-text("Remove"), button:has-text("Remove"), .remove, .delete');
          if (removeLink) {
            await removeLink.click();
            
            await this.page.waitForLoadState('networkidle');
            await this.page.waitForTimeout(500); // Short wait for AJAX
            
            return;
          }
          
          // Fallback to checkbox method
          let removeCheckbox = null;
          if (tds.length >= 8) {
            const td7 = tds[7];
            const inputs = await td7.$$('input');
            
            for (let i = 0; i < inputs.length; i++) {
              const input = inputs[i];
              const name = await input.getAttribute('name');
              if (name === 'removefromcart') {  // Note: wishlist uses 'removefromcart' not 'removefromwishlist'
                removeCheckbox = input;
                break;
              }
            }
          }
          
          if (!removeCheckbox) {
            // Fallback: search in the whole row
            removeCheckbox = await row.$('input[name="removefromcart"]');
          }
          
          if (removeCheckbox) {
            // Use JS to check the checkbox
            await removeCheckbox.evaluate(el => (el as HTMLInputElement).checked = true);
            
            // Click the main update button
            const updateButton = this.page.locator('#updatecart');
            await updateButton.click();
            
            // Wait for the page to reload after submission
            await this.page.waitForLoadState('domcontentloaded');
            
            return;
          }
        }
      }
      
      throw new Error(`Product ${productName} not found in wishlist`);
    } catch (error) {
      console.error(`Error removing ${productName} from wishlist:`, error);
      throw error;
    }
  }

  async clickProductLink(productName: string) {
    const productLink = this.page.locator(`a:has-text("${productName}")`);
    await productLink.click();
    await this.page.waitForLoadState('networkidle');
  }

  async updateItemQuantity(productName: string, quantity: number) {
    const quantityInput = this.page.locator(`tr:has-text("${productName}") input[name*="quantity"]`);
    await quantityInput.fill(quantity.toString());
    const updateButton = this.page.locator('input[name="updatewishlist"]');
    await updateButton.click();
    await this.page.waitForLoadState('networkidle');
  }

  async getWishlistItems(): Promise<{name: string, price: string, hasImage: boolean}[]> {
    // Make sure we're on the wishlist page
    if (!this.page.url().includes('/wishlist')) {
      await this.goto();
    }
    
    const items = [];
    const itemRows = this.page.locator('.wishlist-content tbody tr:not(.cart-footer-row)');
    const rowCount = await itemRows.count();
    
    for (let i = 0; i < rowCount; i++) {
      const row = itemRows.nth(i);
      
      // Get the product name from the link in the row
      const productLink = row.locator('td a.product-name');
      const name = await productLink.textContent() || '';
      
      // Get the price from the appropriate td
      const priceCell = row.locator('td').nth(4); // Assuming price is in 5th column
      const price = await priceCell.textContent() || '';
      
      // Check for image
      const imageElement = row.locator('td img');
      const hasImage = await imageElement.count() > 0;
      
      if (name && name.trim()) {
        items.push({ name: name.trim(), price: price?.trim() || '', hasImage });
      }
    }
    
    return items;
  }
}
