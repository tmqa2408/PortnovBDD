import { chromium } from '@playwright/test';
import WishlistPage from './pages/wishlistPage';
import LoginPage from './pages/loginPage';
import { config } from 'dotenv';

config();

async function debugWishlist() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const loginPage = new LoginPage(page);
    const wishlistPage = new WishlistPage(page);

    // Login
    await loginPage.open();
    await loginPage.login(process.env.EMAIL!, process.env.PASSWORD!);

    // Check wishlist link before adding
    const countBefore = await wishlistPage.getWishlistCount();
    console.log(`Wishlist count before: ${countBefore}`);

    // Go to homepage
    await page.goto('https://nop-qa.portnov.com/');
    await page.waitForLoadState('networkidle');

    // Add product
    await wishlistPage.addProductToWishlist('HTC One M8 Android L 5.0 Lollipop');

    // Check count after
    const countAfter = await wishlistPage.getWishlistCount();
    console.log(`Wishlist count after: ${countAfter}`);

    // Go to wishlist page
    await wishlistPage.goto();
    const items = await wishlistPage.getWishlistItems();
    console.log(`Items in wishlist: ${items.length}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await browser.close();
  }
}

debugWishlist();