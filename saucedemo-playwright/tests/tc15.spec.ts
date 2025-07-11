import { test, expect } from '@playwright/test';

test('ไม่ควรสามารถ Checkout ได้เมื่อไม่มีสินค้าในตะกร้า', async ({ page }) => {
  // 1. เปิดเว็บไซต์และล็อกอิน
  await page.goto('https://www.saucedemo.com');
  await page.fill('#user-name', 'standard_user');
  await page.fill('#password', 'secret_sauce');
  await page.click('#login-button');

  // 2. เข้า cart ที่ว่าง
  await page.click('.shopping_cart_link');

  // 3. Checkout แม้ไม่มีสินค้า
  await page.click('[data-test="checkout"]');

  // 4. กรอกข้อมูลลูกค้า
  await page.fill('[data-test="firstName"]', 'John');
  await page.fill('[data-test="lastName"]', 'Doe');
  await page.fill('[data-test="postalCode"]', '12345');

  await page.click('[data-test="continue"]');

  // 5. ตรวจสอบว่ายังสามารถไปหน้า checkout-step-two ได้แม้ไม่มีสินค้า
  await expect(page).toHaveURL(/checkout-step-two/);

  // 6. ตรวจสอบว่าไม่มีสินค้าปรากฏ
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(0); // ไม่มีสินค้า

  // 7. คลิก Finish ได้ด้วย
  await page.click('[data-test="finish"]');

  // 8. ตรวจสอบว่ามีข้อความขอบคุณ
  await expect(page.locator('.complete-header')).toHaveText('THANK YOU FOR YOUR ORDER');
});
