import { test, expect } from '@playwright/test';

test('ไม่กรอก Zip Code แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // Step 1: เปิดเว็บไซต์
  await page.goto('https://www.saucedemo.com');

  // Step 2: ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Step 3: คลิก Add to cart ที่ T-Shirt
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');

  // Step 4: เข้าหน้า Cart
  await page.click('.shopping_cart_link');

  // Step 5: คลิก Checkout
  await page.click('[data-test="checkout"]');

  // Step 6: กรอก First Name
  await page.fill('[data-test="firstName"]', 'John');

  // Step 7: กรอก Last Name
  await page.fill('[data-test="lastName"]', 'Doe');

  // Step 8: ไม่กรอก Zip Code แล้วคลิก Continue
  await page.click('[data-test="continue"]');

  // Step 9: ตรวจสอบว่าแสดง Error ว่า Postal Code ต้องกรอก
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');
});
