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
    };
  },

  async clickContinue(page: Page) {
    const { continueButton } = this.getFields(page);
    await continueButton.click();
  },

  async verifyErrorMessage(page: Page, expectedText: string) {
    const { errorBox } = this.getFields(page);
    await expect(errorBox).toBeVisible({ timeout: 5000 });
    await expect(errorBox).toHaveText(expectedText, { timeout: 5000 });
  },

  async verifyNoErrorMessage(page: Page) {
    const { errorBox } = this.getFields(page);
    await expect(errorBox).toBeHidden({ timeout: 5000 });
  },

  async verifyOnCheckoutPage(page: Page) {
    await expect(page).toHaveURL(/.*checkout-step-one\.html/, { timeout: 5000 });
    await expect(page.locator('.title')).toHaveText('Checkout: Your Information', { timeout: 5000 });
  },

  async verifyOnCheckoutOverviewPage(page: Page) {
    await expect(page).toHaveURL(/checkout-step-two/, { timeout: 5000 });
    const { cartItem, summaryTotalLabel } = this.getFields(page);
    await expect(cartItem).toBeVisible({ timeout: 5000 });
    await expect(summaryTotalLabel).toBeVisible({ timeout: 5000 });
  },

  // เพิ่มเมธอดนี้เข้าไปเพื่อใช้งานในเทสต์ได้สะดวก
  async verifyCartItemVisible(page: Page) {
    const { cartItem } = this.getFields(page);
    await expect(cartItem).toBeVisible({ timeout: 5000 });
  },
  async verifyCartItemCount(page: Page, expectedCount: number) {
  const { cartItem } = this.getFields(page);
  await expect(cartItem).toHaveCount(expectedCount, { timeout: 5000 });
},
async verifyCartSummaryVisible(page: Page) {
  const { cartItem, summaryTotalLabel } = this.getFields(page);
  await expect(cartItem).toBeVisible({ timeout: 5000 });
  await expect(summaryTotalLabel).toBeVisible({ timeout: 5000 });
},
 async verifyOrderCompleteMessage(page: Page) {
    await expect(this.completeHeader(page)).toHaveText('Thank you for your order!', { timeout: 5000 });
  },

  async verifyOnOrderCompletePage(page: Page) {
    await expect(page).toHaveURL(/checkout-complete/, { timeout: 5000 });
  },

};
