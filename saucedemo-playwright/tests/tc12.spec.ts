import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('เพิ่มสินค้า 2 ชิ้นแล้วเข้าสู่หน้า Checkout สำเร็จ พร้อมแสดงสินค้า', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await page.goto(url.base);
    await page.locator(locator.input_username).fill(userData.username);
    await page.locator(locator.input_password).fill(userData.password);
    await page.locator(locator.btn_login).click();

  // 2. เพิ่มสินค้า 2 ชิ้น
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBackpack);

  // 3. เข้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. คลิก Checkout
  await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 5. กรอกข้อมูลลูกค้า
  page.locator(locator.input_firstName).fill('John');
  page.locator(locator.input_lastName).fill('Doe');
  page.locator(locator.input_postalCode).fill('12345');

  // 6. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 7. ตรวจสอบว่าอยู่ในหน้า Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 8. ตรวจสอบว่าไม่มี Error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

  // 9. ตรวจสอบว่ามีสินค้าทั้ง 2 ชิ้นแสดงอยู่ (ใช้เมธอด Locator)
  await CheckoutPage.verifyCartItemCount(page, 2);

  // 10. ตรวจสอบว่ามีราคารวมแสดง (ใช้เมธอด Locator)
  await CheckoutPage.verifyCartSummaryVisible(page);
});
