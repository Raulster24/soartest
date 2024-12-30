const { expect } = require('@playwright/test');

class BasketPage {
    constructor(page) {
        this.page = page;
        this.cartNumber = page.locator('.cart-number');
        this.successPopup = page.locator('.success-popup');
        this.basketItems = page.locator('.basket-items');
        this.totalPrice = page.locator('.total-price');
        this.checkoutButton = page.locator('.checkout-button');
        this.addressForm = page.locator('.address-form');
        this.deliveryMethod = page.locator('.delivery-method');
        this.paymentScreen = page.locator('.payment-screen');
        this.walletBalance = page.locator('.wallet-balance');
        this.addCardButton = page.locator('.add-card-button');
    }

    async login(username, password) {
        await this.page.goto('https://example.com/login');
        await this.page.fill('#username', username);
        await this.page.fill('#password', password);
        await this.page.click('#login-button');
    }

    async addProductsToBasket(products) {
        for (let product of products) {
            await this.page.goto(`https://example.com/product/${product}`);
            await this.page.click('.add-to-basket-button');
            await expect(this.successPopup).toBeVisible();
        }
        await expect(this.cartNumber).toHaveText('5');
    }

    async navigateToBasket() {
        await this.page.goto('https://example.com/basket');
    }

    async modifyBasket() {
        await this.page.click('.increase-quantity-button');
        await this.page.click('.delete-product-button');
        await expect(this.totalPrice).toHaveTextChanged();
    }

    async checkout() {
        await this.page.click(this.checkoutButton);
        await this.page.fill(this.addressForm, {
            address: '123 Test St',
            city: 'Test City',
            zip: '12345'
        });
        await this.page.click(this.deliveryMethod);
        await expect(this.paymentScreen).toBeVisible();
        await expect(this.walletBalance).toHaveText('0');
        await this.page.click(this.addCardButton);
        await this.page.fill('.card-number', '4111111111111111');
        await this.page.fill('.card-expiry', '12/25');
        await this.page.fill('.card-cvc', '123');
        await this.page.click('.continue-purchase-button');
    }
}

module.exports = BasketPage;