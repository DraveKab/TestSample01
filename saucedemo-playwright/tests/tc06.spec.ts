import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('tc06: กรอกอักขระพิเศษใน First/Last Name และเลขถูกต้องใน ZIP Code แล้วระบบยอมให้เข้า Checkout', async ({ page }) => {
  // Step 1: เปิดเว็บไซต์และล็อกอิน
  await page.goto(url.base);
    await page.locator(locator.input_username).fill(userData.username);
    await page.locator(locator.input_password).fill(userData.password);
    await page.locator(locator.btn_login).click();

  // Step 2: เพิ่มสินค้าลงในตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);


  // Step 3: คลิก Checkout
  await page.locator(locator.btn_checkout).click();
    await CheckoutPage.verifyOnCheckoutPage(page);

  // Step 4: กรอกข้อมูล First Name, Last Name ด้วยอักขระพิเศษ และ Postal Code ด้วยตัวเลขที่ถูกต้อง
    page.locator(locator.input_firstName).fill('@@@');
      page.locator(locator.input_lastName).fill('###');
      page.locator(locator.input_postalCode).fill('54321');

  // Step 5: คลิก Continue
  await test.step('5. คลิก Continue', async () => {
    await CheckoutPage.clickContinue(page);
  });

  // Step 6: ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview และไม่มี Error แสดง
  await test.step('6. ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview และไม่มี Error แสดง', async () => {
    await CheckoutPage.verifyOnCheckoutOverviewPage(page);
    await CheckoutPage.verifyNoErrorMessage(page);
  });

  // Step 7: ตรวจสอบว่ามีสินค้าแสดงในหน้าสรุป
  await test.step('7. ตรวจสอบว่ามีสินค้าแสดงในหน้าสรุป', async () => {
    await CheckoutPage.verifyCartItemVisible(page);
  });
});
