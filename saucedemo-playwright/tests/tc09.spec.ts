import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้
import { input_lastName } from './../resources/locator/Checkout';

test('กรอก First/Last Name เป็นตัวพิมพ์เล็ก และ Zip Code เป็นตัวเลข ระบบยังให้เข้าสู่หน้า Checkout', async ({ page }) => {
  // 1. เปิดเว็บ
  await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();



  // 2. Add T-Shirt เข้า cart
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);

  // 3. เข้า cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. Checkout
   await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);
      
  // 5. กรอกข้อมูล First/Last Name (พิมพ์เล็ก) และ Zip Code เป็นตัวเลข
   await page.locator(locator.input_firstName).fill('john');
   await page.locator(locator.input_lastName).fill('doe');
   await page.locator(locator.input_postalCode).fill('12345');

  // 6. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 7. ตรวจสอบว่าเว็บยังให้ไปต่อหน้า Checkout Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 8. ตรวจสอบว่าไม่มี error และสินค้าแสดงอยู่
  await CheckoutPage.verifyNoErrorMessage(page);
  await CheckoutPage.verifyCartSummaryVisible(page);
});
