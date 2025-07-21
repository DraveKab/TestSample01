import { test } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('ไม่กรอก Zip Code แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  // 1. เปิดเว็บและล็อกอิน
   await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();

;

  // 2. เพิ่มสินค้าและไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);


  // 3. ไปหน้า Checkout
   await page.locator(locator.btn_checkout).click();
    await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอก First Name, Last Name (ไม่กรอก Zip Code)
  await page.locator(locator.input_firstName).fill('John');
  await page.locator(locator.input_lastName).fill('Doe');

  // 5. กด Continue
   await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบ Error ว่า Zip Code ต้องกรอก และยังอยู่หน้า Checkout
  await CheckoutPage.verifyErrorMessage(page, expectedError.postalCodeRequired);
  await CheckoutPage.verifyOnCheckoutPage(page);
});
