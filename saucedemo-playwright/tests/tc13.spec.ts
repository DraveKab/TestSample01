import { test, expect } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testdata';

test('เพิ่มสินค้าทั้งหมด 6 ชิ้นและตรวจสอบที่หน้า Checkout Overview', async ({ page }) => {
  const checkout = new CheckoutPage(page);

  // 1. เข้าสู่เว็บไซต์
  await page.goto(url.base);

  // 2. ล็อกอิน
  await page.fill('#user-name', userData.username);
  await page.fill('#password', userData.password);
  await page.click('#login-button');

  // 3. เพิ่มสินค้าทั้งหมด 6 รายการลงในตะกร้า (ใช้ selectors จาก testData.ts)
  await page.click(productSelector.sauceLabsBackpack);
  await page.click(productSelector.sauceLabsBikeLight);
  await page.click(productSelector.sauceLabsBoltTShirt);
  await page.click(productSelector.sauceLabsFleeceJacket);
  await page.click(productSelector.sauceLabsOnesie);
  await page.click(productSelector.tShirtRed);

  // 4. เข้าหน้า Cart
  await page.click('.shopping_cart_link');

  // 5. คลิก Checkout
  await page.click('[data-test="checkout"]');

  // 6–8. กรอกข้อมูลลูกค้า
  await checkout.firstName.fill('John');
  await checkout.lastName.fill('Doe');
  await checkout.postalCode.fill('12345');

  // 9. ดำเนินการต่อไปหน้า Checkout Overview
  await checkout.clickContinue();

  // 10. ตรวจสอบว่าหน้าปัจจุบันเป็น checkout overview
  await expect(page).toHaveURL(/checkout-step-two/);
  // ตรวจสอบว่าไม่มี error box แสดงขึ้น
  await expect(checkout.errorBox).not.toBeVisible();

  // ตรวจสอบว่ามีสินค้าครบ 6 ชิ้นแสดงอยู่
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(6);

  // ตรวจสอบว่ามีราคารวมแสดง
  await expect(page.locator('.summary_total_label')).toBeVisible();
});