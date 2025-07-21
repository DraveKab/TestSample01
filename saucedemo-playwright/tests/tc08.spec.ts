import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('กรอกตัวพิมพ์ใหญ่ล้วนในทุกช่อง และระบบยังให้เข้า checkout ได้', async ({ page }) => {
  // 1. เปิดเว็บ และ Login
 await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();



  // 2. Add to cart สินค้า T-Shirt
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);

  // 3. เข้า cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. คลิก CHECKOUT
   await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 5. กรอกข้อมูลแบบพิมพ์ใหญ่ล้วน
   await page.locator(locator.input_firstName).fill('JOHN');
   await page.locator(locator.input_lastName).fill('DOE');
   await page.locator(locator.input_postalCode).fill('12345');

  // 6. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 7. ตรวจสอบว่า ระบบยังยอมให้เข้าสู่หน้า Checkout Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 8. ตรวจสอบว่าไม่มี Error box แสดงขึ้น
  await CheckoutPage.verifyNoErrorMessage(page);

  // 9. ตรวจสอบว่าสินค้าและราคารวมยังแสดงอยู่
  await CheckoutPage.verifyCartSummaryVisible(page);
});
