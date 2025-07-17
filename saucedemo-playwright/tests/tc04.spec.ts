import { test } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';

test('ไม่กรอก Zip Code แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
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

  // 4. กรอก First Name, Last Name (ไม่กรอก Zip Code)
  const fields = CheckoutPage.getFields(page);
  await fields.firstName.fill('John');
  await fields.lastName.fill('Doe');

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบ Error ว่า Zip Code ต้องกรอก และยังอยู่หน้า Checkout
  await CheckoutPage.verifyErrorMessage(page, expectedError.postalCodeRequired);
  await CheckoutPage.verifyOnCheckoutPage(page);
});
