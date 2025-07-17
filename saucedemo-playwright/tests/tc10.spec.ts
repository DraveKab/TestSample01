import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('กรอกชื่อผสม (อังกฤษ+ไทย) และระบบยังให้ผ่านหน้า Checkout', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await LoginPage.goto(page, url.base);

  // 2. Login
  await LoginPage.login(page, userData.username, userData.password);

  // 3. เพิ่มสินค้าเข้าตะกร้า
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);

  // 4. ไปหน้าตะกร้า
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. ไปหน้า Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6. กรอกชื่อผสม: อังกฤษ + ไทย + กรอก Postal Code ที่ถูกต้อง
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('aaa');    // อังกฤษ
  await checkoutFields.lastName.fill('กกก');     // ไทย
  await checkoutFields.postalCode.fill('12345'); // ตัวเลขที่ถูกต้อง

  // 7. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบว่าเข้าสู่หน้า Checkout Overview ได้สำเร็จ
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 9. ตรวจสอบว่าไม่มี Error แสดงขึ้น
  await CheckoutPage.verifyNoErrorMessage(page);

  // 10. ตรวจสอบว่าสินค้าแสดงอยู่ในหน้าสรุป
  await CheckoutPage.verifyCartSummaryVisible(page);
});
