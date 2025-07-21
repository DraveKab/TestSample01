import { test } from '@playwright/test';
import { CheckoutPage } from '../resources/locator/CheckoutPage';
import { LoginPage } from '../resources/locator/LoginPage';
import { ProductsPage } from '../resources/locator/ProductsPage';
import { CartPage } from '../resources/locator/CartPage';
import { userData, productSelector, url } from '../resources/demo/testdata/testData';
import * as locator from '../resources/locator/index'; // <== เพิ่มบรรทัดนี้

test('กรอกชื่อ-นามสกุลเป็นตัวเลข แล้วระบบยังยอมให้ไปหน้า Checkout', async ({ page }) => {
  // 1. เปิดเว็บไซต์และล็อกอิน
  await page.goto(url.base);
    await page.locator(locator.input_username).fill(userData.username);
    await page.locator(locator.input_password).fill(userData.password);
    await page.locator(locator.btn_login).click();

  // 2. เพิ่มสินค้าและไปหน้าตะกร้า
  await ProductsPage.addProductToCart(page, locator.btn_add_tShirtRed);
  await ProductsPage.gotoCart(page);
  await CartPage.verifyOnCartPage(page);


  // 3. ไปหน้ากรอกข้อมูล Checkout
  await page.locator(locator.btn_checkout).click();
    await CheckoutPage.verifyOnCheckoutPage(page);

  // 4. กรอกชื่อ-นามสกุลเป็นตัวเลข และ Postal Code ที่ถูกต้อง
  const checkoutFields = CheckoutPage.getFields(page);
  page.locator(locator.input_firstName).fill('12345');
  page.locator(locator.input_lastName).fill('67890');
  page.locator(locator.input_postalCode).fill('54321');

  // 5. กด Continue
  await CheckoutPage.clickContinue(page);

  // 6. ตรวจสอบว่าระบบยอมให้ไปหน้า Checkout Overview (checkout-step-two)
  await CheckoutPage.verifyOnCheckoutOverviewPage(page);

  // 7. ตรวจสอบว่าไม่มี error box แสดง
  await CheckoutPage.verifyNoErrorMessage(page);
});
