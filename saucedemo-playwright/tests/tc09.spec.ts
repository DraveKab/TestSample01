import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('กรอก First/Last Name เป็นตัวพิมพ์เล็ก และ Zip Code เป็นตัวเลข ระบบยังให้เข้าสู่หน้า Checkout', async ({ page }) => {
  // 1. เปิดเว็บ
  await LoginPage.goto(page, url.base);

  // 2. Login ด้วย user มาตรฐาน
  await LoginPage.login(page, userData.username, userData.password);

  // 3. Add T-Shirt เข้า cart
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);

  // 4. เข้า cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6. กรอกข้อมูล First/Last Name (พิมพ์เล็ก) และ Zip Code เป็นตัวเลข
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('john');
  await checkoutFields.lastName.fill('doe');
  await checkoutFields.postalCode.fill('12345');

  // 7. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบว่าเว็บยังให้ไปต่อหน้า Checkout Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 9. ตรวจสอบว่าไม่มี error และสินค้าแสดงอยู่
  await CheckoutPage.verifyNoErrorMessage(page);
  await CheckoutPage.verifyCartSummaryVisible(page);
});
