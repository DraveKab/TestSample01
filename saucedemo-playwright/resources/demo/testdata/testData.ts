// resource/demo/testdata/testData.ts
export const userData = {
  username: 'standard_user',
  password: 'secret_sauce',
};

// resource/demo/testdata/testData.ts
export const productSelector = {
  tShirtRed: '[data-test="add-to-cart-test.allthethings()-t-shirt-(red)"]',
  sauceLabsBackpack: '[data-test="add-to-cart-sauce-labs-backpack"]',
  sauceLabsBikeLight: '[data-test="add-to-cart-sauce-labs-bike-light"]',
  sauceLabsBoltTShirt: '[data-test="add-to-cart-sauce-labs-bolt-t-shirt"]',
  sauceLabsFleeceJacket: '[data-test="add-to-cart-sauce-labs-fleece-jacket"]',
  sauceLabsOnesie: '[data-test="add-to-cart-sauce-labs-onesie"]',
  // ... (selector อื่นๆ)
};
// ... (ส่วนอื่นๆ ของ testData)
export const url = {
  base: 'https://www.saucedemo.com',
};

export const expectedError = {
  lastNameRequired: 'Error: Last Name is required',
  postalCodeRequired: 'Error: Postal Code is required',
  firstNameRequired: 'Error: First Name is required', // ตรวจสอบว่ามีบรรทัดนี้อยู่
};