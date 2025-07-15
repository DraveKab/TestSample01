import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('กรอกชื่อผสม (อังกฤษ+ไทย+พิเศษ) แล้วระบบยังให้ผ่านหน้า Checkout', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เข้าเว็บไซต์
  await page.goto(url.base);

  // 2. Login
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. Add to cart
  await page.click(productSelector.tShirtRed);
  await page.click('.shopping_cart_link');

  // 4. Checkout
  await page.click('[data-test="checkout"]');

  // 5–7. กรอกข้อมูลผสม
  // หมายเหตุ: Saucedemo.com ยอมรับอักขระผสมใน First Name และ Last Name โดยไม่มีการ Validation
  // Postal Code ถูกกรอกด้วยตัวเลขที่ถูกต้องเพื่อให้ Test Case ผ่านตามชื่อ
  await checkout.firstName.fill('aaa');   // อังกฤษ
  await checkout.lastName.fill('กกก');    // ไทย
  await checkout.postalCode.fill('12345'); // ตัวเลขที่ถูกต้อง

  // 8. คลิก Continue
  await checkout.clickContinue();

  // 9. ตรวจสอบว่ายังเข้าหน้า Checkout Overview ได้
  await expect(page).toHaveURL(/checkout-step-two/);
  // ตรวจสอบว่าไม่มี error box แสดงขึ้น (ยืนยันว่าไม่มีการ Validation ที่ทำให้ติด)
  await expect(checkout.errorBox).not.toBeVisible();

  // 10. มีรายละเอียดสินค้าแสดง
  await expect(page.locator('.cart_item')).toBeVisible();
});