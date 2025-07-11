import { test, expect } from '@playwright/test';

test('เพิ่มสินค้า 2 ชิ้นแล้วเข้าสู่หน้า Checkout สำเร็จ พร้อมแสดงสินค้า', async ({ page }) => {
  // 1. เปิดเว็บ
  await page.goto('https://www.saucedemo.com');

  // 2. ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 3. เพิ่มสินค้าทั้ง 2 ชิ้น
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');

  // 4. เข้า Cart
  await page.click('.shopping_cart_link');

  // 5. คลิก Checkout
  await page.click('[data-test="checkout"]');

  // 6–8. กรอกข้อมูล
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');

  // 9. Continue
  await page.click('[data-test="continue"]');

  // 10. ตรวจสอบว่าไปหน้า Checkout Overview
  await expect(page).toHaveURL(/checkout-step-two/);

  //  ตรวจสอบว่ามีสินค้าทั้ง 2 ชิ้นแสดง
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);

  //  ตรวจสอบว่ามีราคารวมแสดง
  await expect(page.locator('.summary_total_label')).toBeVisible();
});
