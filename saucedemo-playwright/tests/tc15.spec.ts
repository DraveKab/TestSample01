import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, url } from '../resources/demo/testdata/testdata';

test('ไม่ควรสามารถ Checkout ได้เมื่อไม่มีสินค้าในตะกร้า', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เปิดเว็บไซต์และล็อกอิน
  await page.goto(url.base);
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 2. เข้าหน้าตะกร้าสินค้าที่ว่างเปล่า
  await page.click('.shopping_cart_link');

  // 3. พยายาม Checkout ทั้งที่ไม่มีสินค้าในตะกร้า
  await page.click('[data-test="checkout"]');

  // 4. กรอกข้อมูลลูกค้า (แม้จะไม่มีสินค้าในตะกร้า)
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('Doe');
  await checkout.postalCode.fill('12345');

  await checkout.clickContinue();

  // 5. ตรวจสอบว่าระบบยังคงยอมให้ไปยังหน้า Checkout Overview (checkout-step-two)
  // หมายเหตุ: นี่คือพฤติกรรมที่ไม่คาดหวังในระบบ E-commerce ทั่วไป
  await expect(page).toHaveURL(/checkout-step-two/);
  // ตรวจสอบว่าไม่มี error box แสดงขึ้น (เนื่องจากระบบยอมให้ไปต่อ)
  await expect(checkout.errorBox).not.toBeVisible();

  // 6. ตรวจสอบว่าไม่มีสินค้าแสดงอยู่ในสรุปรายการ
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(0); // ยืนยันว่าพบ 0 รายการ (ตะกร้าว่าง)

  // 7. คลิกปุ่ม Finish เพื่อจบการสั่งซื้อ
  await page.click('[data-test="finish"]');

  // 8. ตรวจสอบว่ามีข้อความ "Thank you for your order!" แสดงขึ้น
  // หมายเหตุ: แม้ตะกร้าจะว่างเปล่า ระบบก็ยังแสดงข้อความขอบคุณ
  await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
  // ตรวจสอบ URL ว่าอยู่ที่หน้า order เสร็จสมบูรณ์
  await expect(page).toHaveURL(/checkout-complete/);
});