const { expect } = require('@playwright/test');

class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.loginButton = 'button#login';
        this.usernameField = 'input#username';
        this.passwordField = 'input#password';
        this.productAddButtons = 'button.add-to-cart';
        this.cartNumber = 'span.cart-number';
        this.successPopup = 'div.success-popup';
        this.basketButton = 'button#basket';
        this.quantityField = 'input.quantity';
        this.deleteButton = 'button.delete';
        this.totalPrice = 'span.total-price';
        this.checkoutButton = 'button#checkout';
        this.addressField = 'input#address';
        this.deliveryMethodSelect = 'mat-cell[role="cell"] .fa-rocket';
        this.paymentScreen = 'div.payment-screen';
        this.walletBalance = 'span.wallet-balance';
        this.addCardButton = 'button#add-card';
        this.cardNumberField = 'input#card-number';
        this.continueToPaymentButton = 'button.nextButton';
    }

    async clickOnCheckoutButton() {
        await this.page.click(this.checkoutButton);
    }

    async selectDeliveryModeAndContinue() {
        await this.page.selectOption(this.deliveryMethodSelect, 'standard');
        await this.page.click(this.continueToPaymentButton);
        await this.page.waitForTimeout(2000); // Wait for the page to load
    }

    async addCardAndPurchase() {
        const walletBalance = await this.page.locator(this.walletBalance).textContent();
        expect(walletBalance).to.equal('$0.00');
        await this.page.click(this.addCardButton);
        await this.page.fill(this.cardNumberField, '4111111111111111');
        await this.page.click(this.continuePurchaseButton);
    }
}

module.exports = CheckoutPage;