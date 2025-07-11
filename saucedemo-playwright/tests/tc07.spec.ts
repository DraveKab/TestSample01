import { test, expect } from '@playwright/test';

test('กรอก ZIP Code เป็นตัวอักษรแล้วระบบยังยอมให้เข้า Checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add T-Shirt เข้า cart
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // กรอกข้อมูลทั้งหมดเป็นพิมพ์ใหญ่
  await page.fill('[data-test="firstName"]', 'AAA');
  await page.fill('[data-test="lastName"]', 'AAA');
  await page.fill('[data-test="postalCode"]', 'AAA'); // ❌ Zip ไม่ใช่ตัวเลข

  await page.click('[data-test="continue"]');

  // ❗️ระบบยังยอมให้เข้าไปต่อ
  await expect(page).toHaveURL(/checkout-step-two/);

  // สินค้าปรากฏ
  await expect(page.locator('.cart_item')).toBeVisible();
});
