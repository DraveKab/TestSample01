import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('เพิ่มสินค้า 2 ชิ้นแล้วเข้าสู่หน้า Checkout สำเร็จ พร้อมแสดงสินค้า', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await LoginPage.goto(page, url.base);

  // 2. ล็อกอิน
  await LoginPage.login(page, userData.username, userData.password);

  // 3. เพิ่มสินค้า 2 ชิ้น
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBackpack);

  // 4. เข้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. คลิก Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6. กรอกข้อมูลลูกค้า
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('Doe');
  await checkoutFields.postalCode.fill('12345');

  // 7. คลิก Continue
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบว่าอยู่ในหน้า Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 9. ตรวจสอบว่าไม่มี Error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

  // 10. ตรวจสอบว่ามีสินค้าทั้ง 2 ชิ้นแสดงอยู่ (ใช้เมธอด Locator)
  await CheckoutPage.verifyCartItemCount(page, 2);

  // 11. ตรวจสอบว่ามีราคารวมแสดง (ใช้เมธอด Locator)
  await CheckoutPage.verifyCartSummaryVisible(page);
});
