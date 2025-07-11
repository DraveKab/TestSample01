import { test, expect } from '@playwright/test';

test('สั่งซื้อสินค้าทั้งหมดจนเสร็จ และแสดง THANK YOU FOR YOUR ORDER', async ({ page }) => {
  // 1. เปิดเว็บไซต์
  await page.goto('https://www.saucedemo.com');

  // 2. ล็อกอิน
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 3–4. เพิ่มสินค้าทั้งหมด 6 ชิ้น
  await page.click('[data-test="add-to-cart-sauce-labs-backpack"]');
  await page.click('[data-test="add-to-cart-sauce-labs-bike-light"]');
  await page.click('[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]');
  await page.click('[data-test="add-to-cart-sauce-labs-fleece-jacket"]');
  await page.click('[data-test="add-to-cart-sauce-labs-onesie"]');
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');

  // 5. เข้า Cart และกด Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // 6–8. กรอกข้อมูลลูกค้า
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');

  // 9. กด Continue → หน้า Checkout Overview
  await page.click('[data-test="continue"]');
  await expect(page).toHaveURL(/checkout-step-two/);
  await expect(page.locator('.cart_item')).toHaveCount(6); // สินค้า 6 ชิ้น

  // 11. กด Finish → หน้า Order Completed
  await page.click('[data-test="finish"]');

  // 12. ตรวจสอบข้อความ THANK YOU
  await expect(page.locator('.complete-header')).toHaveText('THANK YOU FOR YOUR ORDER');

  // ✅ หน้านี้คือ https://www.saucedemo.com/checkout-complete.html
  await expect(page).toHaveURL(/checkout-complete/);
});
