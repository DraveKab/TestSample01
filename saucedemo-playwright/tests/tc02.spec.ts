import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';

test('ไม่กรอก Last Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // 1. เปิดเว็บไซต์ และล็อกอิน
  await LoginPage.goto(page, url.base);
  await LoginPage.login(page, userData.username, userData.password);
  await ProductsPage.verifyOnProductsPage(page);

  // 2. เพิ่มสินค้า และไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 3. ไปหน้ากรอกข้อมูล Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอก First Name อย่างเดียว
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบ Error: Last Name จำเป็นต้องกรอก
  await CheckoutPage.verifyErrorMessage(page, expectedError.lastNameRequired);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 7. กรอก Last Name แล้วกด Continue อีกครั้ง
  await checkoutFields.lastName.fill('Doe');
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบ Error: Postal Code จำเป็นต้องกรอก
  await CheckoutPage.verifyErrorMessage(page, expectedError.postalCodeRequired);
  await CheckoutPage.verifyOnCheckoutPage(page);
});
