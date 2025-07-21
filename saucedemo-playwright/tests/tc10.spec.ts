import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('กรอกชื่อผสม (อังกฤษ+ไทย) และระบบยังให้ผ่านหน้า Checkout', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await page.goto(url.base);
    await page.locator(locator.input_username).fill(userData.username);
    await page.locator(locator.input_password).fill(userData.password);
    await page.locator(locator.btn_login).click();

  // 2. เพิ่มสินค้าเข้าตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);

  // 3. ไปหน้าตะกร้า
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. ไปหน้า Checkout
  await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 5. กรอกชื่อผสม: อังกฤษ + ไทย + กรอก Postal Code ที่ถูกต้อง
  page.locator(locator.input_firstName).fill('aaa');    // อังกฤษ
  page.locator(locator.input_lastName).fill('กกก');     // ไทย
  page.locator(locator.input_postalCode).fill('12345'); // ตัวเลขที่ถูกต้อง

  // 6. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 7. ตรวจสอบว่าเข้าสู่หน้า Checkout Overview ได้สำเร็จ
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 8. ตรวจสอบว่าไม่มี Error แสดงขึ้น
  await CheckoutPage.verifyNoErrorMessage(page);

  // 9. ตรวจสอบว่าสินค้าแสดงอยู่ในหน้าสรุป
  await CheckoutPage.verifyCartSummaryVisible(page);
});
