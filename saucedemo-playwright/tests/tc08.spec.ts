import { test, expect } from '@playwright/test';

test('กรอกตัวพิมพ์ใหญ่ล้วนในทุกช่อง และระบบยังให้เข้า checkout ได้', async ({ page }) => {
  // 1. เปิดเว็บ
  await page.goto('https://www.saucedemo.com');

  // 2. Login
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 3. Add to cart สินค้า T-Shirt
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');

  // 4. เข้า cart
  await page.click('.shopping_cart_link');

  // 5. คลิก CHECKOUT
  await page.click('[data-test="checkout"]');

  // 6. กรอกข้อมูลแบบพิมพ์ใหญ่ล้วน
  await page.fill('[data-test="firstName"]', 'AAA');
  await page.fill('[data-test="lastName"]', 'AAA');
  await page.fill('[data-test="postalCode"]', 'AAA'); //  ไม่ใช่ตัวเลข

  // 7. คลิก Continue
  await page.click('[data-test="continue"]');

  // 8. ตรวจสอบว่า ระบบยังยอมให้เข้าสู่หน้า Checkout (ไม่ตรง expected)
  await expect(page).toHaveURL(/checkout-step-two/);

  // 9. ตรวจสอบว่าสินค้าและราคารวมยังแสดงอยู่
  await expect(page.locator('.cart_item')).toBeVisible();
  await expect(page.locator('.summary_total_label')).toBeVisible();
});