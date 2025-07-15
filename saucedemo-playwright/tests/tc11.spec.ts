import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('กรอก First Name และ Last Name เหมือนกัน แล้ว Checkout ได้สำเร็จ', async ({ page }) => {
  const checkout = new CheckoutPage(page); // ใช้ตัวพิมพ์ใหญ่ตามมาตรฐานของ Class

  // 1. เข้าหน้าเว็บไซต์
  await page.goto(url.base);

  // 2. ล็อกอินด้วย user มาตรฐาน
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. เพิ่ม T-Shirt เข้าตะกร้า
  await page.click(productSelector.tShirtRed);

  // 4. ไปยังหน้าตะกร้าสินค้า แล้วคลิกปุ่ม Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // 5. กรอก First Name และ Last Name ด้วยค่าที่เหมือนกัน และกรอก Postal Code ที่ถูกต้อง
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('John');
  await checkout.postalCode.fill('12345');

  // 6. คลิกปุ่ม Continue
  await checkout.clickContinue();

  // 7. ตรวจสอบว่า Checkout ดำเนินการไปยังหน้าสรุปสินค้า (checkout-step-two)
  await expect(page).toHaveURL(/checkout-step-two/);

  // 8. ตรวจสอบว่าไม่มี Error box แสดงขึ้น (ยืนยันว่าไม่มีการ Validation ที่ทำให้ติด)
  await expect(checkout.errorBox).not.toBeVisible();

  // 9. ตรวจสอบว่ารายละเอียดสินค้าแสดงอยู่ในหน้าสรุป เพื่อยืนยันว่าดำเนินการสำเร็จ
  await expect(page.locator('.cart_item')).toBeVisible();
});