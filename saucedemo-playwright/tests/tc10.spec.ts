import { test, expect } from '@playwright/test';

test('กรอกชื่อผสม (อังกฤษ+ไทย+พิเศษ) แล้วระบบยังให้ผ่านหน้า Checkout', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await page.goto('https://www.saucedemo.com');

  // 2. Login
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 3. Add to cart
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');
  await page.click('.shopping_cart_link');

  // 4. Checkout
  await page.click('[data-test="checkout"]');

  // 5–7. กรอกข้อมูลผสม
  await page.fill('[data-test="firstName"]', 'aaa');  // อังกฤษ
  await page.fill('[data-test="lastName"]', 'กกก');   // ไทย
  await page.fill('[data-test="postalCode"]', '@@@'); // อักขระพิเศษ

  // 8. คลิก Continue
  await page.click('[data-test="continue"]');

  // 9. ตรวจสอบว่ายังเข้า checkout ได้ (ผิดจากที่ควรจะเป็น)
  await expect(page).toHaveURL(/checkout-step-two/);

  // 10. มีรายละเอียดสินค้าแสดง
  await expect(page.locator('.cart_item')).toBeVisible();
});
