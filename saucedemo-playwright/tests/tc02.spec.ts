import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage'; // ตรวจสอบเส้นทางให้ถูกต้อง
import { userData, productSelector, url, expectedError } from '../resources/demo/testdata/testdata'; // ตรวจสอบเส้นทางให้ถูกต้อง

test('ไม่กรอก Last Name แล้วกด Continue ต้องแสดง Error', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เปิดเว็บไซต์
  await page.goto(url.base);

  // 2. ล็อกอิน
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. คลิก Add to Cart สินค้า T-Shirt
  await page.click(productSelector.tShirtRed);

  // 4. คลิก Cart
  await page.click('.shopping_cart_link');

  // 5. คลิก Checkout
  await page.click('[data-test="checkout"]');

  // 6. กรอกเฉพาะ First Name (เว้น Last Name และ Zip Code)
  await checkout.firstName.fill('John');

  // 7. คลิก Continue
  await checkout.clickContinue();

  // 8. ตรวจสอบ Error: Last Name จำเป็นต้องกรอก โดยใช้ verifyErrorMessage
  await checkout.verifyErrorMessage(expectedError.lastNameRequired);

  // 9. กรอก Last Name แล้วกด Continue (ยังไม่กรอก Zip)
  await checkout.lastName.fill('Doe');
  await checkout.clickContinue();

  // 10. ตรวจสอบ Error: Zip Code จำเป็นต้องกรอก โดยใช้ verifyErrorMessage
  await checkout.verifyErrorMessage(expectedError.postalCodeRequired);
});