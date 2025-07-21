import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index';

test('ไม่กรอก Last Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // 1. เปิดเว็บไซต์ และล็อกอิน
   await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();


  // 2. เพิ่มสินค้า และไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);


  // 3. ไปหน้ากรอกข้อมูล Checkout
   page.locator(locator.btn_checkout).click();
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอก First Name อย่างเดียว
   page.locator(locator.input_firstName).fill('John');

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบ Error: Last Name จำเป็นต้องกรอก
  await CheckoutPage.verifyErrorMessage(page, expectedError.lastNameRequired);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 7. กรอก Last Name แล้วกด Continue อีกครั้ง
   page.locator(locator.input_lastName).fill('Doe');
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบ Error: Postal Code จำเป็นต้องกรอก
  await CheckoutPage.verifyErrorMessage(page, expectedError.postalCodeRequired);
  await CheckoutPage.verifyOnCheckoutPage(page);
});
