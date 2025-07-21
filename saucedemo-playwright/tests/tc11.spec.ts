import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('กรอก First Name และ Last Name เหมือนกัน แล้ว Checkout ได้สำเร็จ', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await page.goto(url.base);
    await page.locator(locator.input_username).fill(userData.username);
    await page.locator(locator.input_password).fill(userData.password);
    await page.locator(locator.btn_login).click();

  // 2. เพิ่มสินค้า T-Shirt ลงในตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);

  // 3. ไปยังหน้าตะกร้าสินค้า
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. คลิกปุ่ม Checkout
  await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 5. กรอก First Name และ Last Name เหมือนกัน พร้อมกรอก Postal Code ที่ถูกต้อง
  page.locator(locator.input_firstName).fill('John');
  page.locator(locator.input_lastName).fill('John');
  page.locator(locator.input_postalCode).fill('12345');

  // 6. คลิกปุ่ม Continue
  await CheckoutPage.clickContinue(page);

  // 7. ตรวจสอบว่าไปยังหน้าสรุปสินค้า (checkout-step-two) สำเร็จ
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 8. ตรวจสอบว่าไม่มี Error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

  // 9. ตรวจสอบว่ามีรายการสินค้าแสดงในหน้าสรุป
  await CheckoutPage.verifyCartSummaryVisible(page);
});
