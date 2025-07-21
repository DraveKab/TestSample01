import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index';

test('ไม่กรอก First Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // 1. เข้าหน้าเว็บไซต์ และล็อกอิน
  await page.goto(url.base);
  await page.locator(locator.input_username).fill(userData.username);
  await page.locator(locator.input_password).fill(userData.password);
  await page.locator(locator.btn_login).click();

  // 2. เพิ่มสินค้า และไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);


  // 3. ไปหน้ากรอกข้อมูล Checkout
  await page.locator(locator.btn_checkout).click();
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอก Last Name และ Postal Code (ไม่กรอก First Name)
  // const { lastName, postalCode } = CheckoutPage.getFields(page);
  page.locator('[data-test="lastname"]').fill('Doe');
  page.locator('[data-test="postalCode"]').fill('12345');


  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบ Error Message
  await CheckoutPage.verifyErrorMessage(page, expectedError.firstNameRequired);
  await CheckoutPage.verifyOnCheckoutPage(page); // ยืนยันยังอยู่หน้า Checkout
});
