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
        this.deliveryMethodSelect = 'select#delivery-method';
        this.paymentScreen = 'div.payment-screen';
        this.walletBalance = 'span.wallet-balance';
        this.addCardButton = 'button#add-card';
        this.cardNumberField = 'input#card-number';
        this.continuePurchaseButton = 'button#continue-purchase';
    }

    async login(username, password) {
        await this.page.click(this.loginButton);
        await this.page.fill(this.usernameField, username);
        await this.page.fill(this.passwordField, password);
        await this.page.click('button#submit-login');
    }

    async addProductsToBasket() {
        for (let i = 0; i < 5; i++) {
            await this.page.click(this.productAddButtons);
            await expect(this.page.locator(this.successPopup)).toBeVisible();
        }
        await expect(this.page.locator(this.cartNumber)).toHaveText('5');
    }

    async navigateToBasket() {
        await this.page.click(this.basketButton);
    }

    async modifyBasket() {
        await this.page.fill(this.quantityField, '2');
        await this.page.click(this.deleteButton);
        const newTotalPrice = await this.page.locator(this.totalPrice).textContent();
        expect(newTotalPrice).not.to.equal(this.previousTotalPrice);
    }

    async checkout() {
        await this.page.click(this.checkoutButton);
        await this.page.fill(this.addressField, '123 Main St');
        await this.page.selectOption(this.deliveryMethodSelect, 'standard');
        await expect(this.page.locator(this.paymentScreen)).toBeVisible();
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