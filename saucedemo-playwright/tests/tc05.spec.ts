import { test, expect } from '@playwright/test';

test('กรอกชื่อ-นามสกุลเป็นตัวเลข แล้วระบบยังยอมให้ไปหน้า Checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  await page.fill('[data-test="firstName"]', '12345');
  await page.fill('[data-test="lastName"]', '12345');
  await page.fill('[data-test="postalCode"]', '12345');
  await page.click('[data-test="continue"]');

  // ระบบจะยอมให้เข้า checkout-step-two
  await expect(page).toHaveURL(/checkout-step-two/);

  // แสดงว่ายังไม่มีการ validate ว่าชื่อเป็นตัวเลข
});
