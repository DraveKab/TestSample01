import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('เพิ่มสินค้า 2 ชิ้นแล้วเข้าสู่หน้า Checkout สำเร็จ พร้อมแสดงสินค้า', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เปิดเว็บไซต์
  await page.goto(url.base);

  // 2. ล็อกอิน
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. เพิ่มสินค้าทั้ง 2 ชิ้น
  await page.click(productSelector.tShirtRed);
  await page.click(productSelector.sauceLabsBackpack); // ใช้ selector จาก testData.ts

  // 4. เข้า Cart
  await page.click('.shopping_cart_link');

  // 5. คลิก Checkout
  await page.click('[data-test="checkout"]');

  // 6–8. กรอกข้อมูลลูกค้า
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('Doe');
  await checkout.postalCode.fill('12345');

  // 9. คลิก Continue
  await checkout.clickContinue();

  // 10. ตรวจสอบว่าไปยังหน้า Checkout Overview ได้สำเร็จ
  await expect(page).toHaveURL(/checkout-step-two/);
  // ตรวจสอบว่าไม่มี error box แสดงขึ้น
  await expect(checkout.errorBox).not.toBeVisible();

  // ตรวจสอบว่ามีสินค้าทั้ง 2 ชิ้นแสดงอยู่
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(2);

  // ตรวจสอบว่ามีราคารวมแสดง
  await expect(page.locator('.summary_total_label')).toBeVisible();
});