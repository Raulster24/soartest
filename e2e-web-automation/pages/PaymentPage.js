const { expect } = require('@playwright/test');

class PaymentPage {
    constructor(page) {
        this.page = page;
        this.addNewCard = page.locator('.mat-expansion-panel-header-title');
        this.nameInput = page.locator('mat-form-field:has(mat-label:text("Name")) input');
        this.cardNumberInput = page.locator('mat-form-field:has(mat-label:text("Card Number")) input');
        this.expiryMonth = page.locator('mat-form-field:has(mat-label:text("Expiry Month")) select');
        this.expiryYear = page.locator('mat-form-field:has(mat-label:text("Expiry Year")) select');
        this.submitButton = page.locator('#submitButton');
        this.payButton = page.locator('button#checkoutButton');
        this.walletBalance = page.locator('span.confirmation.card-title');
    }

    async enterCardNumber(cardNumber) {
        await this.cardNumberInput.fill(cardNumber);
    }

    async clickPayButton() {
        await this.payButton.click();
    }

    async addCreditCard(name, cardNumber, expiryMonth, expiryYear) {
        await this.addNewCard.nth(0).click();
        await this.nameInput.fill(name);
        await this.enterCardNumber(cardNumber);
    
        // Select expiry month
        await this.expiryMonth.selectOption(expiryMonth);
    
        await this.expiryYear.selectOption(expiryYear);
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
        const balanceText = (await this.walletBalance.innerText()).trim();
        expect(balanceText).toBe('0.00');
    }

    async navigateToReviewPage() {
        await this.page.locator('button[aria-label="Proceed to review"]').click();
    }

    async verifyPaymentSuccess() {
        await expect(this.page.locator('h1.confirmation')).toHaveText('Thank you for your purchase!');
    }
}

module.exports = PaymentPage;