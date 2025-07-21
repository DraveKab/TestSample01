import { Page, expect } from '@playwright/test';

export const CheckoutPage = {
  getFields(page: Page) {
    return {
      firstName: page.locator('[data-test="firstName"]'),
      lastName: page.locator('[data-test="lastName"]'),
      postalCode: page.locator('[data-test="postalCode"]'),
      continueButton: page.locator('[data-test="continue"]'),
      errorBox: page.locator('h3[data-test="error"]'),
      cartItem: page.locator('.cart_item'),
      summaryTotalLabel: page.locator('.summary_total_label'),
      completeHeader: page.locator('.complete-header'), // ✅ เพิ่ม locator สำหรับข้อความ “Thank you for your order!”
    };
  },

  async clickContinue(page: Page) {
    const { continueButton } = this.getFields(page);
    await continueButton.click();
  },

  async verifyErrorMessage(page: Page, expectedText: string) {
    const { errorBox } = this.getFields(page);
    await expect(errorBox).toBeVisible({ timeout: 60000 });
    await expect(errorBox).toHaveText(expectedText, { timeout: 60000 });
  },

  async verifyNoErrorMessage(page: Page) {
    const { errorBox } = this.getFields(page);
    await expect(errorBox).toBeHidden({ timeout: 60000 });
  },

  async verifyOnCheckoutPage(page: Page) {
    await expect(page).toHaveURL(/.*checkout-step-one\.html/, { timeout: 60000 });
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information', { timeout: 60000 });
  },

  async verifyOnCheckoutOverviewPage(page: Page) {
    await expect(page).toHaveURL(/checkout-step-two/, { timeout: 60000 });

    const { cartItem, summaryTotalLabel } = this.getFields(page);

    const count = await cartItem.count();
    expect(count).toBeGreaterThan(0); // อย่างน้อยต้องมี 1 รายการ

    for (let i = 0; i < count; i++) {
      await expect(cartItem.nth(i)).toBeVisible({ timeout: 60000 });
    }

    await expect(summaryTotalLabel).toBeVisible({ timeout: 60000 });
  },

  async verifyCartItemVisible(page: Page) {
    const { cartItem } = this.getFields(page);
    const count = await cartItem.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(cartItem.nth(i)).toBeVisible({ timeout: 60000 });
    }
  },

  async verifyCartItemCount(page: Page, expectedCount: number) {
    const { cartItem } = this.getFields(page);
    await expect(cartItem).toHaveCount(expectedCount, { timeout: 60000 });
  },

  async verifyCartSummaryVisible(page: Page) {
    const { cartItem, summaryTotalLabel } = this.getFields(page);
    const count = await cartItem.count();
    expect(count).toBeGreaterThan(0);

    for (let i = 0; i < count; i++) {
      await expect(cartItem.nth(i)).toBeVisible({ timeout: 60000 });
    }

    await expect(summaryTotalLabel).toBeVisible({ timeout: 60000 });
  },

  async verifyOrderCompleteMessage(page: Page) {
    const { completeHeader } = this.getFields(page); // ✅ เรียกจาก getFields
    await expect(completeHeader).toHaveText('Thank you for your order!', { timeout: 60000 });
  },

  async verifyOnOrderCompletePage(page: Page) {
    await expect(page).toHaveURL(/checkout-complete/, { timeout: 60000 });
  },
};
