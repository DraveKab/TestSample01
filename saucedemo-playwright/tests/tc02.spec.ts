import { test, expect } from '@playwright/test';

test('ไม่กรอก Last Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // [1] เปิดเว็บไซต์
  await page.goto('https://www.saucedemo.com');

  // [2] ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // [3] คลิก Add to Cart สินค้า T-Shirt
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');

  // [4] คลิก Cart
  await page.click('.shopping_cart_link');

  // [5] คลิก Checkout
  await page.click('[data-test="checkout"]');

  // [6] กรอกเฉพาะ First Name (เว้น Last Name และ Zip Code)
  await page.fill('[data-test="firstName"]', 'John');

  // [7] คลิก Continue
  await page.click('[data-test="continue"]');

  // [8.1] ตรวจสอบ Error: Last Name จำเป็นต้องกรอก
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: Last Name is required');

  // [9] กรอก Last Name แล้วกด Continue (ยังไม่กรอก Zip)
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.click('[data-test="continue"]');

  // [10] ตรวจสอบ Error: Zip Code จำเป็นต้องกรอก
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: Postal Code is required');

});
