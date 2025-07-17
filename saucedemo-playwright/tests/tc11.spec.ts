import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('กรอก First Name และ Last Name เหมือนกัน แล้ว Checkout ได้สำเร็จ', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await LoginPage.goto(page, url.base);

  // 2. ล็อกอินด้วย user มาตรฐาน
  await LoginPage.login(page, userData.username, userData.password);

  // 3. เพิ่มสินค้า T-Shirt ลงในตะกร้า
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);

  // 4. ไปยังหน้าตะกร้าสินค้า
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. คลิกปุ่ม Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6. กรอก First Name และ Last Name เหมือนกัน พร้อมกรอก Postal Code ที่ถูกต้อง
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('John');
  await checkoutFields.postalCode.fill('12345');

  // 7. คลิกปุ่ม Continue
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบว่าไปยังหน้าสรุปสินค้า (checkout-step-two) สำเร็จ
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 9. ตรวจสอบว่าไม่มี Error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

  // 10. ตรวจสอบว่ามีรายการสินค้าแสดงในหน้าสรุป
  await CheckoutPage.verifyCartSummaryVisible(page);
});
