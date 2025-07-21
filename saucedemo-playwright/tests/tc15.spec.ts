import { test, expect } from '@playwright/test';
import { LoginPage } from '../resources/locator/LoginPage';
import { CartPage } from '../resources/locator/CartPage';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { userData, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index';
import { ProductsPage } from '../resources/locator/ProductsPage';

test('ไม่ควรสามารถ Checkout ได้เมื่อไม่มีสินค้าในตะกร้า', async ({ page }) => {
  // 1. เปิดเว็บไซต์และล็อกอิน
  await page.goto('https://www.saucedemo.com/');
  await page.locator('[data-test="username"]').fill('standard_user');
  await page.locator('[data-test="password"]').fill('secret_sauce');
  await page.locator('[data-test="login-button"]').click();

  // 2. เข้าไปที่หน้าตะกร้าสินค้าที่ว่างเปล่า
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);

  // 3. ตรวจสอบว่าตะกร้าว่าง
  const cartItems = page.locator('.cart_item');
  await expect(cartItems).toHaveCount(0);

  // 4. คลิกปุ่ม Checkout (ระบบจะพาไปหน้า checkout-step-one)
  const checkoutBtn = page.locator('[data-test="checkout"]');
  await checkoutBtn.click();

  // 5. รอโหลดหน้า checkout-step-one
  await page.waitForLoadState('networkidle');

  // 6. ตรวจสอบว่า URL เป็นหน้า checkout-step-one
  await expect(page).toHaveURL(/checkout-step-one/);
});