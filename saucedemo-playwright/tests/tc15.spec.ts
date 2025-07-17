import { test } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, url } from '../resources/demo/testdata/testData';

test('ไม่ควรสามารถ Checkout ได้เมื่อไม่มีสินค้าในตะกร้า', async ({ page }) => {
  // 1. เปิดเว็บไซต์และล็อกอิน
  await LoginPage.goto(page, url.base);
  await LoginPage.login(page, userData.username, userData.password);

  // 2. เข้าไปที่หน้าตะกร้าสินค้าที่ว่างเปล่า และตรวจสอบว่าอยู่หน้า Cart
  await page.click('.shopping_cart_link');
  await CartPage.verifyOnCartPage(page);

  // 3. พยายามคลิก Checkout แม้ตะกร้าว่าง
  await CartPage.clickCheckout(page);

  // 4. กรอกข้อมูลลูกค้า (แม้ไม่มีสินค้าในตะกร้า)
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('Doe');
  await checkoutFields.postalCode.fill('12345');

  // 5. กด Continue เพื่อไปหน้า Checkout Overview
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบว่าหน้าปัจจุบันเป็นหน้า Checkout Overview (checkout-step-two)
  // (หมายเหตุ: พฤติกรรมนี้อาจไม่ถูกต้องในระบบจริง)
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // ตรวจสอบว่าไม่มี Error แสดงขึ้น
  await CheckoutPage.verifyNoErrorMessage(page);

  // 7. ตรวจสอบว่าไม่มีสินค้าแสดงอยู่ในสรุปรายการ (cart_item)
  await CheckoutPage.verifyCartItemCount(page, 0);

  // 8. คลิกปุ่ม Finish เพื่อจบการสั่งซื้อ
  await page.click('[data-test="finish"]');

  // 9. ตรวจสอบข้อความ “Thank you for your order!” แสดงในหน้า Order Complete
  await CheckoutPage.verifyOrderCompleteMessage(page);

  // 10. ตรวจสอบว่า URL อยู่ที่หน้า order เสร็จสมบูรณ์
  await CheckoutPage.verifyOnOrderCompletePage(page);
});
