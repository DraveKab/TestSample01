import { test, expect } from '@playwright/test';

test('กรอกข้อมูลครบและไปหน้า Checkout ได้สำเร็จ', async ({ page }) => {
  // Step 1: เปิดเว็บ
  await page.goto('https://www.saucedemo.com');

  // Step 2: Login
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // Step 3: Add T-Shirt เข้า cart
  await page.click('[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]');

  // Step 4: เข้าหน้า Cart
  await page.click('.shopping_cart_link');

  // Step 5: คลิก Checkout
  await page.click('[data-test="checkout"]');

  // Step 6: กรอก First Name, Last Name
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');

  // Step 7: กรอก Zip Code
  await page.fill('[data-test="postalCode"]', '12345');

  // Step 8: คลิก Continue
  await page.click('[data-test="continue"]');

  // Step 9: ตรวจสอบว่าอยู่ที่หน้าสรุปสินค้า (checkout-step-two)
  await expect(page).toHaveURL(/checkout-step-two/);

  // ตรวจสอบว่ามีรายละเอียดสินค้า (locator อิงจาก class ที่ใช้จริง)
  await expect(page.locator('.cart_item')).toBeVisible(); // รายการสินค้า
  await expect(page.locator('.summary_total_label')).toBeVisible(); // ราคารวม
});
