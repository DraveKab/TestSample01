import { test, expect } from '@playwright/test';

test('Zip Code เป็นตัวอักษรพิมพ์เล็ก ระบบยังให้เข้าสู่หน้า Checkout', async ({ page }) => {
  await page.goto('https://www.saucedemo.com');

  // Login ด้วย user มาตรฐาน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Add T-Shirt เข้า cart
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('.shopping_cart_link');

  // Checkout
  await page.click('[data-test="checkout"]');

  // กรอกข้อมูลผิดที่ zip (ใช้ตัวอักษรแทนตัวเลข)
  await page.fill('[data-test="firstName"]', 'aaa');
  await page.fill('[data-test="lastName"]', 'aaa');
  await page.fill('[data-test="postalCode"]', 'aaa'); // ไม่ใช่ตัวเลข

  await page.click('[data-test="continue"]');

  // ❗ ตรวจสอบว่าเว็บยังให้ไปต่อ
  await expect(page).toHaveURL(/checkout-step-two/);

  // ❗ ระบบไม่แสดง error (ไม่มี validation)
  await expect(page.locator('.cart_item')).toBeVisible();
});
