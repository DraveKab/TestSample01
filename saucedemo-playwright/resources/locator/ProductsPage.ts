import { Page, expect } from '@playwright/test';
import * as locator from './index'; // นำเข้า locator กลาง

export const ProductsPage = {
  async addProductToCart(page: Page, productSelector: string) {
    await page.locator(productSelector).click();
  },

  async gotoCart(page: Page) {
    await page.locator(locator.cart_link).click(); // ใช้ locator จากไฟล์กลาง
    await expect(page).toHaveURL(/.*cart\.html/, { timeout: 60000  });
  },

  async verifyOnProductsPage(page: Page) {
    await expect(page).toHaveURL(/.*inventory\.html/, { timeout: 60000  });
    await expect(page.locator(locator.title_products)).toHaveText('Products', { timeout: 60000  });
  },
};
