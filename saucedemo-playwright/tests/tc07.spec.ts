import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';

test('tc07: กรอก ZIP Code เป็นตัวอักษร → ยอมให้ไปต่อหน้า Overview ได้', async ({ page }) => {
  // 1. เปิดเว็บและล็อกอิน
  await LoginPage.goto(page, url.base);
  await LoginPage.login(page, userData.username, userData.password);
  await ProductsPage.verifyOnProductsPage(page);

  // 2. เพิ่มสินค้าและไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 3. ไปหน้า Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอกข้อมูล First Name, Last Name และ Postal Code (เป็นตัวอักษร)
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('Doe');
  await checkoutFields.postalCode.fill('aaa'); // ตัวอักษร ไม่ใช่ตัวเลข

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบว่าระบบให้ไปหน้า Checkout Overview (checkout-step-two)
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 7. ตรวจสอบว่าไม่มี Error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

 // 8. ตรวจสอบว่ายังมีสินค้าในหน้าสรุป (verify จำนวนสินค้า)
await CheckoutPage.verifyCartItemCount(page, 1);
});
