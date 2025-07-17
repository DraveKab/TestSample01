import { test } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('กรอกชื่อ-นามสกุลเป็นตัวเลข แล้วระบบยังยอมให้ไปหน้า Checkout', async ({ page }) => {
  // 1. เปิดเว็บไซต์และล็อกอิน
  await LoginPage.goto(page, url.base);
  await LoginPage.login(page, userData.username, userData.password);
  await ProductsPage.verifyOnProductsPage(page);

  // 2. เพิ่มสินค้าและไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 3. ไปหน้ากรอกข้อมูล Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอกชื่อ-นามสกุลเป็นตัวเลข และ Postal Code ที่ถูกต้อง
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('12345');
  await checkoutFields.lastName.fill('67890');
  await checkoutFields.postalCode.fill('54321');

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview (checkout-step-two)
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 7. ตรวจสอบว่าไม่มี error box แสดง
  await CheckoutPage.verifyNoErrorMessage(page);
});
