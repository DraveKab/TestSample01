import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('กรอกตัวพิมพ์ใหญ่ล้วนในทุกช่อง และระบบยังให้เข้า checkout ได้', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เปิดเว็บ
  await page.goto(url.base);

  // 2. Login
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. Add to cart สินค้า T-Shirt
  await page.click(productSelector.tShirtRed);

  // 4. เข้า cart
  await page.click('.shopping_cart_link');

  // 5. คลิก CHECKOUT
  await page.click('[data-test="checkout"]');

  // 6. กรอกข้อมูลแบบพิมพ์ใหญ่ล้วน
  // หมายเหตุ: Saucedemo.com ยอมรับตัวพิมพ์ใหญ่ใน First Name และ Last Name โดยไม่มีการ Validation
  // และ Postal Code ที่เป็นตัวเลขถูกต้องก็จะผ่านไปได้
  await checkout.firstName.fill('JOHN');
  await checkout.lastName.fill('DOE');
  await checkout.postalCode.fill('12345'); // ใช้ตัวเลขที่ถูกต้องเพื่อให้ Test Case ผ่านตามชื่อ

  // 7. คลิก Continue
  await checkout.clickContinue();

  // 8. ตรวจสอบว่า ระบบยังยอมให้เข้าสู่หน้า Checkout ได้
  await expect(page).toHaveURL(/checkout-step-two/);

  // ตรวจสอบเพิ่มเติมว่าไม่มี Error box แสดงขึ้น (ยืนยันว่าไม่มีการ Validation ที่ทำให้ติด)
  await expect(checkout.errorBox).not.toBeVisible();

  // 9. ตรวจสอบว่าสินค้าและราคารวมยังแสดงอยู่
  await expect(page.locator('.cart_item')).toBeVisible();
  await expect(page.locator('.summary_total_label')).toBeVisible();
});