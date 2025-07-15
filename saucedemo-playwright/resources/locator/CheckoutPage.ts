// resources/locator/CheckoutPage.ts
import { Locator, Page, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  // Existing locators
  readonly firstName: Locator;
  readonly lastName: Locator;
  readonly postalCode: Locator;
  readonly continueButton: Locator;

  // Adjusted errorBox locator to be more specific based on the image
  readonly errorBox: Locator; // Changed to target h3[data-test="error"]

  constructor(page: Page) {
    this.page = page;
    this.firstName = page.locator('[data-test="firstName"]');
    this.lastName = page.locator('[data-test="lastName"]');
    this.postalCode = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');

    // Adjusted: Target the h3 element with data-test="error"
    this.errorBox = page.locator('h3[data-test="error"]');
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  // Method สำหรับ Verify Error Message
  async verifyErrorMessage(expectedText: string) {
    // เพิ่ม timeout ให้สูงขึ้นเล็กน้อย (ถ้าจำเป็น) เผื่อ network delay
    // แต่ด้วย locator ที่เฉพาะเจาะจงขึ้น น่าจะไม่ต้องเพิ่มมาก
    await expect(this.errorBox).toBeVisible({ timeout: 5000 }); // 5 วินาทีก็พอ
    await expect(this.errorBox).toHaveText(expectedText);
  }
}