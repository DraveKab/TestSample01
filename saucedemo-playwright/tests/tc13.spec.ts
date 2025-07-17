import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('เพิ่มสินค้าทั้งหมด 6 ชิ้นและตรวจสอบที่หน้า Checkout Overview', async ({ page }) => {
  // 1. เข้าเว็บไซต์
  await LoginPage.goto(page, url.base);

  // 2. ล็อกอิน
  await LoginPage.login(page, userData.username, userData.password);
  await ProductsPage.verifyOnProductsPage(page);

  // 3. เพิ่มสินค้าทั้งหมด 6 รายการลงในตะกร้า
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBackpack);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBikeLight);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBoltTShirt);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsFleeceJacket);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsOnesie);
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);

  // 4. เข้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. คลิก Checkout
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6-8. กรอกข้อมูลลูกค้า
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('Doe');
  await checkoutFields.postalCode.fill('12345');

  // 9. คลิก Continue เพื่อไปหน้า Overview
  await CheckoutPage.clickContinue(page);

  // 10. ตรวจสอบว่าอยู่หน้า Checkout Overview
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // ตรวจสอบว่าไม่มี error แสดง
  await CheckoutPage.verifyNoErrorMessage(page);

  // ตรวจสอบว่ามีสินค้าครบ 6 ชิ้นในหน้า Overview
  await CheckoutPage.verifyCartItemCount(page, 6);

  // ตรวจสอบว่ามีราคารวมแสดงในหน้า Overview
  await CheckoutPage.verifyCartSummaryVisible(page);
});
