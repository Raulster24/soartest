const { test } = require('@playwright/test');

const JuiceShopPage = require('../pages/JuiceShopPage');
const RegistrationPage = require('../pages/RegistrationPage');
const LoginPage = require('../pages/LoginPage');
const BasketPage = require('../pages/BasketPage');
const CheckoutPage = require('../pages/CheckoutPage');
const AddressPage = require('../pages/AddressPage');
const PaymentPage = require('../pages/PaymentPage');

let juiceShopPage;
let registrationPage;
let loginPage;
let basketPage;
let checkoutPage;
let addressPage;
let paymentPage;

const testUserData = {
  email: `testuser${Date.now()}@example.com`,
  password: 'Test@1234',
  repeatPassword: 'Test@1234',
  securityQuestion: 'Your favorite pet?',
  securityAnswer: 'Dog'
};

test.beforeEach(async ({ page }) => {
  juiceShopPage = new JuiceShopPage(page);
  registrationPage = new RegistrationPage(page);
  loginPage = new LoginPage(page);
  basketPage = new BasketPage(page);
  checkoutPage = new CheckoutPage(page);
  addressPage = new AddressPage(page);
  paymentPage = new PaymentPage(page);

  await juiceShopPage.goto();
  await juiceShopPage.dismissWelcomeBanner();
  await juiceShopPage.clickConsentButton();
});

test('Task 1 - Display all items on homepage', async ({ page }) => {
  await juiceShopPage.scrollToPaginator();
  await page.waitForTimeout(2000);
  await juiceShopPage.selectMaxPagination();
  // Assert that the homepage displays all items
  await juiceShopPage.verifyAllItemsDisplayed();
  await juiceShopPage.verifyMaxPaginatorRange();
});


test('Task 2 - Interact with first product', async ({ page }) => {
  await juiceShopPage.verifyFirstProductName();
  await juiceShopPage.clickOnFirstProduct();
  await page.waitForTimeout(6000);
  // Assert that the popup appeared and the image of the product exists
  await juiceShopPage.verifyProductPopup();
  await juiceShopPage.verifyProductImage();
  // If there is a review, click on it to expand the review
  await juiceShopPage.expandProductReview();
  // Wait for a couple of seconds
  await page.waitForTimeout(3000);
  // Close the product form
  await juiceShopPage.closeProductForm();
});

test('Task 3 - User registration and login', async ({ page }) => {
  // Navigate to registration page
  await registrationPage.navigateTo();
  // Assert input validation messages
  await registrationPage.clickOnAllFieldsWithoutValues();
  await registrationPage.verifyValidationMessages();

  // Fill registration form with required data
  await registrationPage.fillForm(testUserData);
  await page.waitForTimeout(2000);
  // Click on show password advice
  await registrationPage.togglePasswordAdvice();
  // Register to application
  await registrationPage.submitForm();
  // Assert successful registration message
  await registrationPage.verifySuccessMessage();

  // Redirect to login page and login with the same information
  await loginPage.navigateTo();
  await loginPage.login(testUserData.email, testUserData.password);
  await page.waitForTimeout(2000);
});

test('Task 4 - Add products to basket and complete purchase', async ({ page }) => {
  // Login to the application
  await loginPage.navigateTo();
  await loginPage.login(testUserData.email, testUserData.password);

  // Add five different products to the basket
  for (let i = 0; i < 5; i++) {
    await juiceShopPage.addProductToBasket(i);
    await juiceShopPage.verifySuccessPopup();
  }

  // Assert that the cart number changed to five
  await juiceShopPage.verifyCartItemCount(5);

  // Navigate to the basket
  const basketPage = new BasketPage(page);
  await basketPage.clickOnBasketToNavigateToBasketPage();

  // Fetch the initial total price
  const initialTotalPrice = await basketPage.fetchInitialTotalPrice();

  await basketPage.increaseProductQuantity();

  await basketPage.deleteProduct();

  // Verify that the total price has been changed
  await basketPage.verifyTotalPriceChanged(initialTotalPrice);

  // Proceed to checkout
  const checkoutPage = new CheckoutPage(page);
  await checkoutPage.clickOnCheckoutButton;

  // Add a new address, select and continue to payment page
  const addressPage = new AddressPage(page);
  await addressPage.addAddress();
  await addressPage.selectAddedAddress();
  await addressPage.clickOnContinueButton();

  // Select delivery method
  await checkoutPage.selectDeliveryModeAndContinue();

  // Navigate to payment screen
  const paymentPage = new PaymentPage(page);

  // Assert that wallet has no money and add credit card information
  await paymentPage.assertWalletBalanceIsZero();
  await paymentPage.addCreditCard({
    name: 'John Doe',
    cardNumber: '4111111111111111',
    expiryDate: '12',
    expiryYear: '2080'
  });
  await paymentPage.selectAddedCard();

 await paymentPage.navigateToReviewPage();
 await paymentPage.clickPayButton();
  await paymentPage.continuePurchase();
  await paymentPage.verifyPaymentSuccess();
});