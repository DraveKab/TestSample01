import { test, expect } from '@playwright/test';

test('กรอก First Name และ Last Name เหมือนกัน แล้ว Checkout ได้สำเร็จ', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // Login
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add T-Shirt
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // กรอก First/Last Name ซ้ำกัน และใส่ Zip
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'John');
  await page.fill('[data-test="postalCode"]', '12345');

  await page.click('[data-test="continue"]');

  // ตรวจสอบว่าสามารถไปหน้า checkout-step-two ได้
  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('.cart_item')).toBeVisible();
});
