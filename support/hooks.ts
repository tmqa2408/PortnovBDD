// support/hooks.ts

// import { Before, After } from "@cucumber/cucumber";
// import { chromium } from "@playwright/test";
// import { CustomWorld } from "./world";

// Before(async function (this: CustomWorld) {
//   this.browser = await chromium.launch({ headless: true });
//   this.context = await this.browser.newContext();
//   this.page = await this.context.newPage();
// });

// After(async function (this: CustomWorld) {
//   await this.page.close();
//   await this.context.close();
//   await this.browser.close();
// });


// // support/hooks.ts
// import { Before, After, setWorldConstructor, ITestCaseHookParameter } from "@cucumber/cucumber";
// import { chromium, Browser, BrowserContext, Page } from "@playwright/test";

// // Кастомный World для хранения браузера/контекста/страницы
// export class CustomWorld {
//   browser!: Browser;
//   context!: BrowserContext;
//   page!: Page;
// }

// setWorldConstructor(CustomWorld);

// Before(async function (this: CustomWorld) {
//   // Запуск браузера
//   this.browser = await chromium.launch({ headless: true });

//   // Создание контекста с записью видео
//   this.context = await this.browser.newContext({
//     recordVideo: { dir: "videos/", size: { width: 1280, height: 720 } }
//   });

//   // Создание новой страницы
//   this.page = await this.context.newPage();
// });

// After(async function (this: CustomWorld, scenario) {
//   try {
//     if (scenario.result?.status === "FAILED") {
//       const screenshotPath = `screenshots/${scenario.pickle.name.replace(/\s+/g, "_")}.png`;
//       await this.page.screenshot({ path: screenshotPath, fullPage: true });
//       console.log(`❌ Screenshot saved: ${screenshotPath}`);

//       // Видео
//       const video = (this.context as any).video?.();
//       if (video) {
//         const videoPath = await video.path();
//         console.log(`🎥 Video saved: ${videoPath}`);
//       }
//     }
//   } finally {
//     await this.page.close();
//     await this.context.close();
//     await this.browser.close();
//   }
// });



// support/hooks.ts
import { Before, After, setWorldConstructor, ITestCaseHookParameter } from "@cucumber/cucumber";
import { chromium, Browser, BrowserContext, Page } from "@playwright/test";
import fs from "fs";
import path from "path";

// Кастомный World
export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
}

setWorldConstructor(CustomWorld);

Before(async function (this: CustomWorld) {
  // Запуск браузера
  this.browser = await chromium.launch({ headless: true });

  // Создание контекста БЕЗ видео
  this.context = await this.browser.newContext();

  // Создание страницы
  this.page = await this.context.newPage();
});

After(async function (this: CustomWorld, scenario: ITestCaseHookParameter) {
  const scenarioNameSafe = scenario.pickle.name.replace(/\s+/g, "_");

  // Скриншот при падении
  if (scenario.result?.status === "FAILED") {
    const screenshotDir = path.resolve("screenshots");
    if (!fs.existsSync(screenshotDir)) fs.mkdirSync(screenshotDir, { recursive: true });
    const screenshotPath = path.join(screenshotDir, `${scenarioNameSafe}.png`);
    await this.page.screenshot({ path: screenshotPath, fullPage: true });
  }

  // Закрываем ресурсы
  await this.page.close();
  await this.context.close();
  await this.browser.close();
});
