import { test, expect } from '@playwright/test';

test('ระบบยอมให้กรอกอักขระพิเศษในข้อมูล Checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // กรอกข้อมูลทั้งหมดเป็น @@@
  await page.fill('[data-test="firstName"]', '@@@');
  await page.fill('[data-test="lastName"]', '@@@');
  await page.fill('[data-test="postalCode"]', '@@@');

  await page.click('[data-test="continue"]');

  // ระบบยังปล่อยให้เข้าไปหน้า Checkout ได้
  await expect(page).toHaveURL(/checkout-step-two/);
});
