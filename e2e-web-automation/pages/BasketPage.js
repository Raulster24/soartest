const { expect } = require('@playwright/test');

class BasketPage {
    constructor(page) {
        this.page = page;
        this.cartNumber = page.locator('.cart-number');
        this.successPopup = page.locator('.success-popup');
        this.basketItems = page.locator('.basket-items');
        this.totalPrice = page.locator('#price');
        this.checkoutButton = page.locator('.checkout-button');
        this.addressForm = page.locator('.address-form');
        this.deliveryMethod = page.locator('.delivery-method');
        this.paymentScreen = page.locator('.payment-screen');
        this.walletBalance = page.locator('.wallet-balance');
        this.addCardButton = page.locator('.add-card-button');
    }

    async clickOnBasketToNavigateToBasketPage() {
        await this.page.click('button[aria-label="Show the shopping cart"]');
    }

    async increaseProductQuantity() {
        await this.page.locator('button[mat-icon-button]:nth-of-type(2)').click();
        await this.page.waitForTimeout(2000); // Wait for the price to update
    }

    async deleteProduct() {
        const deleteButton = await this.page.locator(".mat-focus-indicator.mat-icon-button.mat-button-base");
        await deleteButton.nth(2).click();  
        await this.page.waitForTimeout(2000);  // Wait for the price to update
    }

    async fetchInitialTotalPrice() {
        const priceText = await this.page.locator('#price').innerText();
        const price = priceText.match(/\d+/)[0];  // Extract the number from the text
        return price;
    }

    async verifyTotalPriceChanged(initialTotalPrice) {
        await this.page.waitForTimeout(2000); // Wait for the price to update
        const updatedTotalPriceText = await this.totalPrice.innerText();
        const updatedTotalPrice = updatedTotalPriceText.match(/\d+/)[0];  // Extract the number from the text
        expect(initialTotalPrice).not.toBe(updatedTotalPrice);
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