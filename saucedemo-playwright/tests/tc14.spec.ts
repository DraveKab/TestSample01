import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('สั่งซื้อสินค้าทั้งหมดจนเสร็จ และแสดง THANK YOU FOR YOUR ORDER', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เปิดเว็บไซต์
  await page.goto(url.base);

  // 2. ล็อกอินด้วย username และ password
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. เพิ่มสินค้าทั้งหมด 6 ชิ้น (ใช้ selectors จาก testData.ts)
  await page.click(productSelector.sauceLabsBackpack);
  await page.click(productSelector.sauceLabsBikeLight);
  await page.click(productSelector.sauceLabsBoltTShirt);
  await page.click(productSelector.sauceLabsFleeceJacket);
  await page.click(productSelector.sauceLabsOnesie);
  await page.click(productSelector.tShirtRed);

  // 4. ไปที่หน้า Cart แล้วกด Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // 5. กรอกข้อมูลลูกค้า
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('Doe');
  await checkout.postalCode.fill('12345');

  // 6. กด Continue ไปหน้า Checkout Overview
  await checkout.clickContinue();
  await expect(page).toHaveURL(/checkout-step-two/);
  // ตรวจสอบว่าไม่มี error box แสดงขึ้น
  await expect(checkout.errorBox).not.toBeVisible();

  // ตรวจสอบว่าสินค้ามีทั้งหมด 6 รายการ
  await expect(page.locator('.cart_item')).toHaveCount(6);

  // 7. กด Finish เพื่อจบการสั่งซื้อ
  await page.click('[data-test="finish"]');

  // 8. ตรวจสอบข้อความ “Thank you for your order!”
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');

  // 9. ตรวจสอบ URL ว่าอยู่ที่หน้า order เสร็จสมบูรณ์
  await expect(page).toHaveURL(/checkout-complete/);
});