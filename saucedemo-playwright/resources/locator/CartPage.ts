import { Page, expect } from '@playwright/test';

export const CartPage = {
  async clickCheckout(page: Page) {
    await page.click('[data-test="checkout"]');
    await expect(page).toHaveURL(/.*checkout-step-one\.html/, { timeout: 60000  });
  },

  async verifyOnCartPage(page: Page) {
    await expect(page).toHaveURL(/.*cart\.html/, { timeout: 60000  });
    await expect(page.locator('.title')).toHaveText('Your Cart', { timeout: 60000  });
  },
};
