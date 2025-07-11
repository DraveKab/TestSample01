import { test, expect } from '@playwright/test';

test('เพิ่มสินค้าทั้งหมด 6 ชิ้นและตรวจสอบที่หน้า Checkout Overview', async ({ page }) => {
  // 1. เข้าสู่เว็บไซต์
  await page.goto('https://www.saucedemo.com');

  // 2. ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 3. เพิ่มสินค้าทั้งหมด 6 รายการลงในตะกร้า
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');                // Backpack
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');              // Light
  await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');            // T-Shirt
  await page.click('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');           // Jacket
  await page.click('[data-test="add-to-cart-sauce-labs-onesie"]');                  // Onesie
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');  // T-Shirt (Red)

  // 4. เข้าหน้า Cart
  await page.click('.shopping_cart_link');

  // 5. คลิก Checkout
  await page.click('[data-test="checkout"]');

  // 6–8. กรอกข้อมูลลูกค้า
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');

  // 9. ดำเนินการต่อไปหน้า Checkout Overview
  await page.click('[data-test="continue"]');

  // 10. ตรวจสอบว่ามีสินค้าครบ 6 ชิ้นแสดงอยู่
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(6); //  ต้องแสดงครบ 6 รายการ

  // ตรวจสอบว่าหน้าปัจจุบันเป็น checkout overview
  await expect(page).toHaveURL(/checkout-step-two/);

  // ตรวจสอบว่ามีราคารวมแสดง
  await expect(page.locator('.summary_total_label')).toBeVisible();
});
