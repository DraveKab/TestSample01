import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('tc07: กรอก ZIP Code เป็นตัวอักษร → ยอมให้ไปต่อหน้า Overview ได้', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // [1] เข้าสู่ระบบ
  await page.goto(url.base);
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // [2] เพิ่มสินค้า T-Shirt
  await page.click(productSelector.tShirtRed);

  // [3] ไปที่ตะกร้า และกด Checkout
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // [4] กรอก First, Last, และ Zip (เป็นตัวอักษรล้วน)
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('Doe');
  await checkout.postalCode.fill('aaa'); // ← ตัวอักษร ไม่ใช่ตัวเลข

  // [5] กด Continue
  await checkout.clickContinue();

  // [6] ✅ ระบบให้ไปหน้าถัดไปได้
  await expect(page).toHaveURL(/checkout-step-two/);

  // [7] ตรวจว่าสินค้ายังอยู่
  await expect(page.locator('.cart_item')).toHaveCount(1);
});
