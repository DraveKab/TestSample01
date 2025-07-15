import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage'; // ตรวจสอบเส้นทางให้ถูกต้อง
import { userData, productSelector, url } from '../resources/demo/testdata/testdata'; // ตรวจสอบเส้นทางให้ถูกต้อง

test('กรอกชื่อ-นามสกุลเป็นตัวเลข แล้วระบบยังยอมให้ไปหน้า Checkout', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. Open the website
  await page.goto(url.base);

  // 2. Log in with your username and password
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. Click "Add to cart" on the T-Shirt
  await page.click(productSelector.tShirtRed);

  // 4. Click CHECKOUT at Your Cart page
  await page.click('.shopping_cart_link');
  await page.click('[data-test="checkout"]');

  // 5. Enter numbers in every textbox
  await checkout.firstName.fill('12345');
  await checkout.lastName.fill('67890');
  await checkout.postalCode.fill('54321'); // Postal Code เป็นตัวเลขที่ถูกต้อง

  // 6. Click Continue at Your information page
  await checkout.clickContinue();

  // 7. ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview (checkout-step-two)
  // เพราะ Saucedemo.com ไม่ได้มีการ Validate ชื่อที่เป็นตัวเลข
  await expect(page).toHaveURL(/checkout-step-two/);

  // ตรวจสอบเพิ่มเติมว่าไม่มี error box แสดงขึ้นมา (ยืนยันว่าไม่มี validation สำหรับชื่อที่เป็นตัวเลข)
  await expect(checkout.errorBox).not.toBeVisible();

  // ตรวจสอบว่ามีรายละเอียดสินค้าแสดงในหน้าสรุป (ยืนยันว่าเข้าหน้าได้สำเร็จ)
  await expect(page.locator('.cart_item')).toBeVisible();
  await expect(page.locator('.summary_total_label')).toBeVisible();
});