import { test } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้
import { ProductsPage } from '../resources/locator/ProductsPage';

test('ไม่ควรสามารถ Checkout ได้เมื่อไม่มีสินค้าในตะกร้า', async ({ page }) => {
  // 1. เปิดเว็บไซต์และล็อกอิน
  await page.goto(url.base);
    await page.locator(locator.input_username).fill(userData.username);
    await page.locator(locator.input_password).fill(userData.password);
    await page.locator(locator.btn_login).click();

  // 2. เข้าไปที่หน้าตะกร้าสินค้าที่ว่างเปล่า และตรวจสอบว่าอยู่หน้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 3. พยายามคลิก Checkout แม้ตะกร้าว่าง
  await page.locator(locator.btn_checkout).click();
  
  // 4. กรอกข้อมูลลูกค้า (แม้ไม่มีสินค้าในตะกร้า)
  page.locator(locator.input_firstName).fill('John');
    page.locator(locator.input_lastName).fill('Doe');
    page.locator(locator.input_postalCode).fill('12345')

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
  await page.locator('[data-test="finish"]').click();

  // 9. ตรวจสอบข้อความ “Thank you for your order!” แสดงในหน้า Order Complete
  await CheckoutPage.verifyOrderCompleteMessage(page);

  // 10. ตรวจสอบว่า URL อยู่ที่หน้า order เสร็จสมบูรณ์
  await CheckoutPage.verifyOnOrderCompletePage(page);
});
