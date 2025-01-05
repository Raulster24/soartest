const { expect } = require('@playwright/test');

class AddressPage {
    constructor(page) {
        this.page = page;
        this.addAddressButton = page.locator('button[aria-label="Add a new address"]');
        this.countryInput = page.locator('input[placeholder="Please provide a country."]');
        this.nameInput = page.locator('input[placeholder="Please provide a name."]');
        this.mobileNumberInput = page.locator('input[placeholder="Please provide a mobile number."]');
        this.zipCodeInput = page.locator('input[placeholder="Please provide a ZIP code."]');
        this.addressInput = page.locator('textarea#address');
        this.cityInput = page.locator('input[placeholder="Please provide a city."]');
        this.stateInput = page.locator('input[placeholder="Please provide a state."]');
        this.submitButton = page.locator('button[type="submit"]');
    }

    async clickOnAddAddressButton() {
        await this.addAddressButton.click();
    }

    async fillAddressForm() {
        const addressData = {
            country: 'USA',
            name: 'John Doe',
            mobileNumber: '1234567890',
            zipCode: '12345',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA'
        };
        await this.countryInput.fill(addressData.country);
        await this.nameInput.fill(addressData.name);
        await this.mobileNumberInput.fill(addressData.mobileNumber);
        await this.zipCodeInput.fill(addressData.zipCode);
        await this.addressInput.fill(addressData.address);
        await this.cityInput.fill(addressData.city);
        await this.stateInput.fill(addressData.state);
    }

    async submitForm() {
        await this.submitButton.click();
    }

    async addAddress() {
        await this.clickOnAddAddressButton();
        await this.page.waitForTimeout(2000);// wait for the page to load
        await this.fillAddressForm();
        await this.submitForm();
        await this.page.waitForTimeout(2000);// wait for the page to load
    }

    async verifySubmission() {
        await expect(this.page.locator('#confirmationMessage')).toHaveText('Address submitted successfully!');
    }

    async selectAddedAddress() {
        const addedAddress = this.page.locator(`mat-cell.mat-column-Address:has-text("123 Main St, Anytown, CA, 12345")`);
        await addedAddress.click();
    }
    async clickOnContinueButton() {
        const continueButton = this.page.locator('button[aria-label="Proceed to payment selection"]');
        await continueButton.click();
        await this.page.waitForTimeout(2000);// Wait for the page to load
    }
}

module.exports = AddressPage;