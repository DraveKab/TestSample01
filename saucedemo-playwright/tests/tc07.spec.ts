import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('tc07: กรอก ZIP Code เป็นตัวอักษร → ยอมให้ไปต่อหน้า Overview ได้', async ({ page }) => {
  // 1. เปิดเว็บและล็อกอิน
   await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();

  // 2. เพิ่มสินค้าและไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);


  // 3. ไปหน้า Checkout
   await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอกข้อมูล First Name, Last Name และ Postal Code (เป็นตัวอักษร)
   await page.locator(locator.input_firstName).fill('John');
   await page.locator(locator.input_lastName).fill('Doe');
   await page.locator(locator.input_postalCode).fill('aaa'); // ตัวอักษร ไม่ใช่ตัวเลข

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบว่าระบบให้ไปหน้า Checkout Overview (checkout-step-two)
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 7. ตรวจสอบว่าไม่มี Error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

 // 8. ตรวจสอบว่ายังมีสินค้าในหน้าสรุป (verify จำนวนสินค้า)
await CheckoutPage.verifyCartItemCount(page, 1);
});
