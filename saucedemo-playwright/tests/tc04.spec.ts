import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage'; // ตรวจสอบเส้นทางให้ถูกต้อง
import { userData, productSelector, url } from '../resources/demo/testdata/testdata'; // ตรวจสอบเส้นทางให้ถูกต้อง

test('กรอกข้อมูลครบและไปหน้า Checkout ได้สำเร็จ', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // Step 1: เปิดเว็บ
  await page.goto(url.base);

  // Step 2: Login
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // Step 3: Add T-Shirt เข้า cart
  await page.click(productSelector.tShirtRed);

  // Step 4: เข้าหน้า Cart
  await page.click('.shopping_cart_link');

  // Step 5: คลิก Checkout
  await page.click('[data-test="checkout"]');

  // Step 6: กรอก First Name
  await checkout.firstName.fill('John');

  // Step 7: กรอก Last Name
  await checkout.lastName.fill('Doe');

  // Step 8: กรอก Zip Code
  await checkout.postalCode.fill('12345');

  // Step 9: คลิก Continue
  await checkout.clickContinue();

  // Step 10: ตรวจสอบว่าอยู่ที่หน้าสรุปสินค้า (checkout-step-two)
  await expect(page).toHaveURL(/checkout-step-two/);

  // ตรวจสอบว่ามีรายละเอียดสินค้า (locator อิงจาก class ที่ใช้จริง)
  await expect(page.locator('.cart_item')).toBeVisible(); // รายการสินค้า
  await expect(page.locator('.summary_total_label')).toBeVisible(); // ราคารวม
});