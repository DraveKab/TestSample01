// test/tc01/required-firstname.spec.ts
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testdata';

test('ไม่กรอก First Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เข้าหน้าเว็บไซต์
  await page.goto(url.base);

  // 2. ล็อกอินเข้าสู่ระบบ
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. เพิ่มสินค้า T-Shirt
  // ใช้ productSelector.tShirtRed เพื่อความถูกต้องตามที่เคยคุยกัน
  await page.click(productSelector.tShirtRed);

  // 4. เข้าสู่หน้าตะกร้าสินค้า และคลิกปุ่ม Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // 5. ไม่กรอก First Name แต่กรอก Last Name และ Postal Code
  await checkout.lastName.fill('Doe');
  await checkout.postalCode.fill('12345');

  // 6. คลิกปุ่ม Continue
  await checkout.clickContinue();

  // 7. ตรวจสอบข้อความ Error โดยใช้ฟังก์ชัน verifyErrorMessage ที่สร้างไว้
  await checkout.verifyErrorMessage(expectedError.firstNameRequired);
});