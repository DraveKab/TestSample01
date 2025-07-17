import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';

test('tc06: กรอกอักขระพิเศษใน First/Last Name และเลขถูกต้องใน ZIP Code แล้วระบบยอมให้เข้า Checkout', async ({ page }) => {
  // Step 1: เปิดเว็บไซต์และล็อกอิน
  await test.step('1. เปิดเว็บไซต์และล็อกอิน', async () => {
    await LoginPage.goto(page, url.base);
    await LoginPage.login(page, userData.username, userData.password);
  });

  // Step 2: เพิ่มสินค้าลงในตะกร้า
  await test.step('2. เพิ่มสินค้าลงในตะกร้า', async () => {
    await page.click(productSelector.tShirtRed);
    await page.click('.shopping_cart_link'); // ไปที่หน้า Cart
  });

  // Step 3: คลิก Checkout
  await test.step('3. คลิก Checkout', async () => {
    await page.click('[data-test="checkout"]');
  });

  // Step 4: กรอกข้อมูล First Name, Last Name ด้วยอักขระพิเศษ และ Postal Code ด้วยตัวเลขที่ถูกต้อง
  await test.step('4. กรอกข้อมูล First Name, Last Name ด้วยอักขระพิเศษ และ Postal Code ด้วยตัวเลขที่ถูกต้อง', async () => {
    const fields = CheckoutPage.getFields(page);
    await fields.firstName.fill('@@@');
    await fields.lastName.fill('###');
    await fields.postalCode.fill('12345');
  });

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
