import { test } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('สั่งซื้อสินค้าทั้งหมดจนเสร็จ และแสดง THANK YOU FOR YOUR ORDER', async ({ page }) => {
  // 1. เปิดเว็บไซต์
await page.goto('https://www.saucedemo.com/');
await page.locator('[data-test="username"]').fill('standard_user');
await page.locator('[data-test="password"]').fill('secret_sauce');
await page.locator('[data-test="login-button"]').click();



  // 2. เพิ่มสินค้าทั้งหมด 6 ชิ้น (ใช้ selectors จาก testData.ts)
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBackpack);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBikeLight);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsBoltTShirt);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsFleeceJacket);
    await ProductsPage.addProductToCart(page, locator.btn_add_sauceLabsOnesie);
    await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
    

  // 3. ไปที่หน้า Cart แล้วตรวจสอบหน้า Cart
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 4. คลิก Checkout แล้วตรวจสอบหน้า Checkout step one
  await page.locator(locator.btn_checkout).click();
      await CheckoutPage.verifyOnCheckoutPage(page);

  // 5. กรอกข้อมูลลูกค้า
  await page.locator(locator.input_firstName).fill('John');
  await page.locator(locator.input_lastName).fill('Doe');
  await page.locator(locator.input_postalCode).fill('12345')

  // 6. คลิก Continue เพื่อไปหน้า Checkout Overview
  await CheckoutPage.clickContinue(page);

  // 7. ตรวจสอบว่าอยู่ที่หน้า Checkout Overview และไม่มี Error แสดง
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);
  await CheckoutPage.verifyNoErrorMessage(page);

  // 8. ตรวจสอบว่ามีสินค้าครบ 6 ชิ้นในหน้า Overview
  await CheckoutPage.verifyCartItemCount(page, 6);

  // 9. คลิก Finish เพื่อจบการสั่งซื้อ
  await page.locator('[data-test="finish"]').click();

  // 10. ตรวจสอบข้อความ “Thank you for your order!” แสดงในหน้า Order Complete
  await CheckoutPage.verifyOrderCompleteMessage(page);

  // 11. ตรวจสอบว่า URL อยู่ที่หน้า order เสร็จสมบูรณ์
  await CheckoutPage.verifyOnOrderCompletePage(page);
});
