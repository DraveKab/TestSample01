import { Page, expect } from '@playwright/test';

export const ProductsPage = {
  async addProductToCart(page: Page, productSelector: string) {
    await page.click(productSelector);
  },

  async gotoCart(page: Page) {
    await page.click('.shopping_cart_link');
    await expect(page).toHaveURL(/.*cart\.html/, { timeout: 5000 });
  },

  async verifyOnProductsPage(page: Page) {
    await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 5000 });
    await expect(page.locator('.title')).toHaveText('Products', { timeout: 5000 });
  },
};
