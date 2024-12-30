const { expect } = require('@playwright/test');

class LoginPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.loginUrl = 'https://juice-shop.herokuapp.com/#/login';
    this.emailInput = '#email';
    this.passwordInput = '#password';
    this.loginButton = '#loginButton';
  }

  async navigateTo() {
    await this.page.goto(this.loginUrl);
  }

  async login(email, password) {
    await this.page.fill(this.emailInput, email);
    await this.page.fill(this.passwordInput, password);
    await this.page.click(this.loginButton);
  }

async verifySuccessfulLogin() {
    await this.page.waitForSelector('.mat-snack-bar-container', { state: 'visible' });
    const snackBarText = await this.page.textContent('.mat-snack-bar-container');
    expect(snackBarText).toContain('Login successful');
}
}

module.exports = LoginPage;