import { test } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('สั่งซื้อสินค้าทั้งหมดจนเสร็จ และแสดง THANK YOU FOR YOUR ORDER', async ({ page }) => {
  // 1. เปิดเว็บไซต์
  await LoginPage.goto(page, url.base);

  // 2. ล็อกอินด้วย username และ password
  await LoginPage.login(page, userData.username, userData.password);
  await ProductsPage.verifyOnProductsPage(page);

  // 3. เพิ่มสินค้าทั้งหมด 6 ชิ้น (ใช้ selectors จาก testData.ts)
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBackpack);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBikeLight);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsBoltTShirt);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsFleeceJacket);
  await ProductsPage.addProductToCart(page, productSelector.sauceLabsOnesie);
  await ProductsPage.addProductToCart(page, productSelector.tShirtRed);

  // 4. ไปที่หน้า Cart แล้วตรวจสอบหน้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 5. คลิก Checkout แล้วตรวจสอบหน้า Checkout step one
  await CartPage.clickCheckout(page);
  await CheckoutPage.verifyOnCheckoutPage(page);

  // 6. กรอกข้อมูลลูกค้า
  const checkoutFields = CheckoutPage.getFields(page);
  await checkoutFields.firstName.fill('John');
  await checkoutFields.lastName.fill('Doe');
  await checkoutFields.postalCode.fill('12345');

  // 7. คลิก Continue เพื่อไปหน้า Checkout Overview
  await CheckoutPage.clickContinue(page);

  // 8. ตรวจสอบว่าอยู่ที่หน้า Checkout Overview และไม่มี Error แสดง
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);
  await CheckoutPage.verifyNoErrorMessage(page);

  // 9. ตรวจสอบว่ามีสินค้าครบ 6 ชิ้นในหน้า Overview
  await CheckoutPage.verifyCartItemCount(page, 6);

  // 10. คลิก Finish เพื่อจบการสั่งซื้อ
  await page.click('[data-test="finish"]');

  // 11. ตรวจสอบข้อความ “Thank you for your order!” แสดงในหน้า Order Complete
  await CheckoutPage.verifyOrderCompleteMessage(page);

  // 12. ตรวจสอบว่า URL อยู่ที่หน้า order เสร็จสมบูรณ์
  await CheckoutPage.verifyOnOrderCompletePage(page);
});
