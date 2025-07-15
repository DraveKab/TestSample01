// tc06.spec.ts
import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('tc06: กรอกอักขระพิเศษใน First/Last Name และเลขถูกต้องใน ZIP Code แล้วระบบยอมให้เข้า Checkout', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // Step 1: เปิดเว็บไซต์และล็อกอิน
  await test.step('1. เปิดเว็บไซต์และล็อกอิน', async () => {
    await page.goto(url.base);
    await page.fill('#user-name', userData.username);
    await page.fill('#password', userData.password);
    await page.click('#login-button');
  });

  // Step 2: เพิ่มสินค้าลงในตะกร้า
  await test.step('2. เพิ่มสินค้าลงในตะกร้า', async () => {
    await page.click(productSelector.tShirtRed);
    await page.click('.shopping_cart_link'); // ไปที่หน้า Cart
  });

  // Step 3: คลิก Checkout
  await test.step('3. คลิก Checkout', async () => {
    await page.click('[data-test="checkout"]');
  });

  // Step 4: กรอกข้อมูล First Name, Last Name ด้วยอักขระพิเศษ และ Postal Code ด้วยตัวเลขที่ถูกต้อง
  await test.step('4. กรอกข้อมูล First Name, Last Name ด้วยอักขระพิเศษ และ Postal Code ด้วยตัวเลขที่ถูกต้อง', async () => {
    await checkout.firstName.fill('@@@'); // อักขระพิเศษใน First Name
    await checkout.lastName.fill('###');  // อักขระพิเศษใน Last Name
    await checkout.postalCode.fill('12345'); // Postal Code ที่ถูกต้อง
  });

  // Step 5: คลิก Continue
  await test.step('5. คลิก Continue', async () => {
    await checkout.clickContinue();
  });

  // Step 6: ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview และไม่มี Error แสดง
  await test.step('6. ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview และไม่มี Error แสดง', async () => {
    await expect(page).toHaveURL(/checkout-step-two/);
    await expect(checkout.errorBox).not.toBeVisible(); // ยืนยันว่าไม่มี error box แสดงขึ้น
  });

  // Step 7: ตรวจสอบว่ามีสินค้าแสดงในหน้าสรุป
  await test.step('7. ตรวจสอบว่ามีสินค้าแสดงในหน้าสรุป', async () => {
    await expect(page.locator('.cart_item')).toBeVisible();
  });
});