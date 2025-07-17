import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('กรอกตัวพิมพ์ใหญ่ล้วนในทุกช่อง และระบบยังให้เข้า checkout ได้', async ({ page }) => {
  // 1. เปิดเว็บ
  await LoginPage.goto(page, url.base);

  // 2. Login
  await LoginPage.login(page, userData.username, userData.password);

  // 3. Add to cart สินค้า T-Shirt
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);

  // 4. เข้า cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. คลิก CHECKOUT
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6. กรอกข้อมูลแบบพิมพ์ใหญ่ล้วน
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('JOHN');
  await checkoutFields.lastName.fill('DOE');
  await checkoutFields.postalCode.fill('12345');

  // 7. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบว่า ระบบยังยอมให้เข้าสู่หน้า Checkout Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 9. ตรวจสอบว่าไม่มี Error box แสดงขึ้น
  await CheckoutPage.verifyNoErrorMessage(page);

  // 10. ตรวจสอบว่าสินค้าและราคารวมยังแสดงอยู่
  await CheckoutPage.verifyCartSummaryVisible(page);
});
