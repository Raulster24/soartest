const { expect } = require('@playwright/test');

class PaymentPage {
    constructor(page) {
        this.page = page;
        this.nameInput = page.locator('#mat-input-1');
        this.cardNumberInput = page.locator('#mat-input-2');
        this.expiryMonth = page.locator('#mat-input-3');
        this.expiryYear = page.locator('#mat-input-4');
        this.cvvInput = page.locator('#mat-input-5');
        this.submitButton = page.locator('#submitButton');
        this.payButton = page.locator('button#checkoutButton');
        this.walletBalance = page.locator('span.confirmation.card-title');
    }

    async enterCardNumber(cardNumber) {
        await this.cardNumberInput.fill(cardNumber);
    }

    async enterCVV(cvv) {
        await this.cvvInput.fill(cvv);
    }

    async clickPayButton() {
        await this.payButton.click();
    }

    async makePayment(name, cardNumber, expiryMonth, expiryYear, cvv) {
        await this.nameInput.fill(name);
        await this.enterCardNumber(cardNumber);
    
        // Select expiry month
        await this.expiryMonth.selectOption({ value: expiryMonth.toString() });
    
        await this.expiryYear.selectOption({ value: expiryYear.toString() });
        await this.submitButton.click();
        await this.page.waitForTimeout(2000); // Wait for some time
    }

    async selectAddedCard() {
        // Locate the first mat-row (excluding the header)
        const firstRow = await this.page.locator('mat-table mat-row').first();
        // Click the radio button within the first row
        await firstRow.locator('mat-radio-button').click();
    }

    async assertWalletBalanceIsZero() {
        const balanceText = (await this.page.walletBalance.innerText()).trim();
        expect(balanceText).toBe('0.00');
    }

    async navigateToReviewPage() {
        await page.locator('button[aria-label="Proceed to review"]').click();
    }

    async verifyPaymentSuccess() {
        await expect(this.page.locator('span.confirmation.card-title')).toHaveText('Payment successful');
    }
}

module.exports = PaymentPage;