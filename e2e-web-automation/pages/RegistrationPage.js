const { expect } = require('@playwright/test');

class RegistrationPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.registrationUrl = 'https://juice-shop.herokuapp.com/#/register';
    this.emailInput = '#emailControl';
    this.passwordInput = '#passwordControl';
    this.repeatPasswordInput = '#repeatPasswordControl';
    this.securityQuestionSelect = 'mat-select[aria-label="Selection list for the security question"]';
    this.securityAnswerInput = '#securityAnswerControl';
    this.registerButton = '#registerButton';
    this.validationMessages = '.mat-error';
    this.successMessage = '.mat-snack-bar-container';
    this.adviceButton = '.mat-slide-toggle-thumb';
  }

  async navigateTo() {
    await this.page.goto(this.registrationUrl);
  }

  async clickOnAllFieldsWithoutValues() {
    await this.page.click(this.emailInput);
    await this.page.click(this.passwordInput);
    await this.page.click(this.repeatPasswordInput);
    await this.page.click(this.securityQuestionSelect);
    await this.page.keyboard.press('Escape');
    await this.page.click(this.securityAnswerInput);
    await this.page.click(this.emailInput); // to remove focus from the last field
  }

  async verifyValidationMessages() {
    const emailMessage = await this.page.waitForSelector('#mat-error-0', { timeout: 5000 });
    expect(await emailMessage.textContent()).toBe('Please provide an email address.');

    const passwordMessage = await this.page.waitForSelector('#mat-error-1', { timeout: 5000 });
    expect(await passwordMessage.textContent()).toBe('Please provide a password. ');

    const repeatPasswordMessage = await this.page.waitForSelector('#mat-error-2', { timeout: 5000 });
    expect(await repeatPasswordMessage.textContent()).toBe(' Please repeat your password. ');

    const securityQuestionMessage = await this.page.waitForSelector('#mat-error-3', { timeout: 5000 });
    expect(await securityQuestionMessage.textContent()).toBe(' Please select a security question. ');

    const securityAnswerMessage = await this.page.waitForSelector('#mat-error-4', { timeout: 5000 });
    expect(await securityAnswerMessage.textContent()).toBe(' Please provide an answer to your security question. ');
  }

  async fillForm(userData) {
    await this.page.fill(this.emailInput, userData.email);
    await this.page.fill(this.passwordInput, userData.password);
    await this.page.fill(this.repeatPasswordInput, userData.repeatPassword);
    await this.page.click(this.securityQuestionSelect);
    await this.page.click(`mat-option:has-text("${userData.securityQuestion}")`);
    await this.page.fill(this.securityAnswerInput, userData.securityAnswer);
  }

  async togglePasswordAdvice() {
    await this.page.click(this.adviceButton);
    await this.page.waitForTimeout(2000);
  }

  async submitForm() {
    await this.page.click(this.registerButton);
  }

  async verifySuccessMessage() {
    await this.page.waitForSelector('.mat-snack-bar-container', { state: 'visible' });
    const snackBarText = await this.page.textContent('.mat-snack-bar-container');
    expect(snackBarText).toContain('Registration completed successfully. You can now log in.X');
  }
}

module.exports = RegistrationPage;