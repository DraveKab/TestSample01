import { test, expect } from '@playwright/test';

test('ไม่กรอก First Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // [1] เปิดเว็บ
  await page.goto('https://www.saucedemo.com');

  // [2] ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // [3] คลิก "Add to cart" สินค้า T-Shirt
  const tshirtAddButton = page.locator('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await tshirtAddButton.click();

  // [4] คลิก Cart icon
  await page.click('.shopping_cart_link');

  // [5] คลิก Checkout
  await page.click('[data-test="checkout"]');

  // [6] ที่หน้า Checkout: ข้ามการกรอกข้อมูล แล้วคลิก Continue
  await page.click('[data-test="continue"]');

  // [7] ตรวจสอบว่าแสดงข้อความ error สำหรับ First Name
  await expect(page.locator('[data-test="error"]')).toBeVisible();
  await expect(page.locator('[data-test="error"]')).toHaveText('Error: First Name is required');
});
