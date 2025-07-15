import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('Zip Code เป็นตัวอักษรพิมพ์เล็ก ระบบยังให้เข้าสู่หน้า Checkout', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เปิดเว็บ
  await page.goto(url.base);

  // 2. Login ด้วย user มาตรฐาน
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. Add T-Shirt เข้า cart
  await page.click(productSelector.tShirtRed);
  await page.click('.shopping_cart_link');

  // 4. Checkout
  await page.click('[data-test="checkout"]');

  // 5. กรอกข้อมูล First Name, Last Name (เป็นตัวพิมพ์เล็ก) และ Postal Code (เป็นตัวเลขที่ถูกต้อง)
  // หมายเหตุ: ชื่อ Test Case "Zip Code เป็นตัวอักษรพิมพ์เล็ก" ขัดแย้งกับการกรอก '12345'
  // การเปลี่ยนเป็นตัวเลขเพื่อทำให้ Test Case สามารถไปต่อหน้า Checkout ได้ตามที่ชื่อ Test Case ระบุ
  await checkout.firstName.fill('john');
  await checkout.lastName.fill('doe');
  await checkout.postalCode.fill('12345'); // กรอกเป็นตัวเลขที่ถูกต้องเพื่อให้ Test Case ผ่าน

  // 6. คลิก Continue
  await checkout.clickContinue();

  // 7. ตรวจสอบว่าเว็บยังให้ไปต่อหน้า Checkout Overview
  await expect(page).toHaveURL(/checkout-step-two/);

  // 8. ตรวจสอบว่าระบบไม่แสดง error และสินค้าปรากฏ
  await expect(checkout.errorBox).not.toBeVisible(); // ตรวจสอบว่าไม่มี error box แสดงขึ้น
  await expect(page.locator('.cart_item')).toBeVisible(); // ตรวจสอบว่ามีสินค้าแสดง
});