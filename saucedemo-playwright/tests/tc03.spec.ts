import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage'; // ตรวจสอบเส้นทางให้ถูกต้อง
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';

test('ไม่กรอก Zip Code แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
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

  // 4. กรอก First Name และ Last Name (แต่ไม่กรอก Postal Code)
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('Doe');

  // 5. กด Continue โดยไม่กรอก Postal Code
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบ Error ว่า Postal Code ต้องกรอก
  await CheckoutPage.verifyErrorMessage(page, expectedError.postalCodeRequired);
  await CheckoutPage.verifyOnCheckoutPage(page); // ยืนยันยังอยู่หน้า Checkout
});
