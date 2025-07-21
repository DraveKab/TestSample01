import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('เพิ่มสินค้าทั้งหมด 6 ชิ้นและตรวจสอบที่หน้า Checkout Overview', async ({ page }) => {
  // 1. เข้าเว็บไซต์
await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();



  // 2. เพิ่มสินค้าทั้งหมด 6 รายการลงในตะกร้า
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBackpack);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBikeLight);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBoltTShirt);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsFleeceJacket);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsOnesie);
    await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
    

  // 3. เข้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. คลิก Checkout
  await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 5-7. กรอกข้อมูลลูกค้า
  await page.locator(locator.input_firstName).fill('John');
  await page.locator(locator.input_lastName).fill('Doe');
  await page.locator(locator.input_postalCode).fill('12345');

  // 8. คลิก Continue เพื่อไปหน้า Overview
  await CheckoutPage.clickContinue(page);

  // 9. ตรวจสอบว่าอยู่หน้า Checkout Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // ตรวจสอบว่าไม่มี error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

  // ตรวจสอบว่ามีสินค้าครบ 6 ชิ้นในหน้า Overview
  await CheckoutPage.verifyCartItemCount(page, 6);

  // ตรวจสอบว่ามีราคารวมแสดงในหน้า Overview
  await CheckoutPage.verifyCartSummaryVisible(page);
});
