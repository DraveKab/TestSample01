import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage'; // ตรวจสอบเส้นทางให้ถูกต้อง
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testdata'; // ตรวจสอบเส้นทางให้ถูกต้อง

test('ไม่กรอก Zip Code แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // Step 1: เปิดเว็บไซต์
  await page.goto(url.base);

  // Step 2: ล็อกอิน
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // Step 3: คลิก Add to cart ที่ T-Shirt
  await page.click(productSelector.tShirtRed);

  // Step 4: เข้าหน้า Cart
  await page.click('.shopping_cart_link');

  // Step 5: คลิก Checkout
  await page.click('[data-test="checkout"]');

  // Step 6: กรอก First Name
  await checkout.firstName.fill('John');

  // Step 7: กรอก Last Name
  await checkout.lastName.fill('Doe');

  // Step 8: ไม่กรอก Zip Code แล้วคลิก Continue
  await checkout.clickContinue();

  // Step 9: ตรวจสอบว่าแสดง Error ว่า Postal Code ต้องกรอก โดยใช้ verifyErrorMessage
  await checkout.verifyErrorMessage(expectedError.postalCodeRequired);
});