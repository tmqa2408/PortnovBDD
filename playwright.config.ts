// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  use: {
    headless: false,
    trace: 'on-first-retry',
    video: 'off',
    screenshot: 'only-on-failure',
  },
});
