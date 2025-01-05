// JuiceShopPage.js
const { expect } = require('@playwright/test');

class JuiceShopPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.dismissButtonSelector = 'button[aria-label="Close Welcome Banner"]';
    this.consentButtonSelector = 'a.cc-dismiss';
    this.paginatorSelector = '.mat-paginator-container';
  }

  async goto() {
    await this.page.goto('https://juice-shop.herokuapp.com/#/');
  }

  async dismissWelcomeBanner() {
    const dismissButton = await this.page.waitForSelector(this.dismissButtonSelector, { timeout: 5000 });
    if (dismissButton) {
      await dismissButton.click();
    }
  }

  async clickConsentButton() {
    const consentButton = await this.page.waitForSelector(this.consentButtonSelector, { timeout: 5000 });
    if (consentButton) {
      await consentButton.click();
    }
  }

  async scrollToPaginator() {
    const paginator = await this.page.waitForSelector(this.paginatorSelector, { timeout: 5000 });
    if (paginator) {
      await paginator.scrollIntoViewIfNeeded();
    }
  }

  async selectMaxPagination() {
    const paginationSelect = await this.page.waitForSelector('mat-select[aria-label="Items per page:"]', { timeout: 5000 });
    await paginationSelect.click();
    const maxOption = await this.page.waitForSelector('mat-option:last-child', { timeout: 5000 });
    const maxItems = await maxOption.innerText();
    await maxOption.click();
    return parseInt(maxItems, 10);
  }

  async countAllProducts() {
    await this.page.waitForSelector('.mat-grid-list', { timeout: 5000 });
    const products = await this.page.$$('.mat-grid-tile');
    return products.length;
  }

  async verifyAllItemsDisplayed() {
    const maxItems = await this.selectMaxPagination();
    const productCount = await this.countAllProducts();
    expect(productCount).toBeLessThanOrEqual(maxItems);

    const products = await this.page.$$('.mat-grid-tile');
    for (let i = 0; i < products.length; i++) {
      const isVisible = await products[i].isVisible();
      expect(isVisible).toBe(true);
    }
  }

  async verifyMaxPaginatorRange() {
    const rangeLabel = await this.page.innerText('.mat-paginator-range-label');
    const maxItems = parseInt(rangeLabel.split(' of ')[1].trim(), 10);
    const productCount = await this.countAllProducts();
    expect(productCount).toBe(maxItems);
  }

  async clickOnFirstProduct() {
    await this.page.waitForSelector('.mat-grid-tile', { timeout: 5000 });
    const firstProduct = await this.page.waitForSelector('.mat-grid-tile', { timeout: 5000 });
    await firstProduct.click();
  }

  async verifyFirstProductName(productName) {
    await this.page.waitForSelector('.mat-grid-tile', { timeout: 5000 });
    const firstProductTitle = await this.page.innerText('.mat-grid-tile .item-name');
    expect(firstProductTitle).toBe("Apple Juice (1000ml)");
  }

  async verifyProductPopup() {
    const popup = await this.page.waitForSelector('.mat-dialog-container', { timeout: 5000 });
    expect(popup).not.toBeNull();
  }

  async verifyProductImage() {
    const productImage = await this.page.waitForSelector('.mat-dialog-container img', { timeout: 5000 });
    expect(productImage).not.toBeNull();
  }

  async expandProductReview() {
    const reviewButton = await this.page.$('.mat-expansion-panel-header');
    if (reviewButton) {
      await reviewButton.click();
    }
  }

  async closeProductForm() {
    const closeButton = await this.page.$('button[aria-label="Close Dialog"]');
    if (closeButton) {
      await closeButton.click();
    }
  }

  async clickAccountButton() {
    const accountButton = await this.page.waitForSelector('#navbarAccount', { timeout: 5000 });
    if (accountButton) {
      await accountButton.click();
    }
  }

  async clickLoginButton() {
    const loginButton = await this.page.waitForSelector('#navbarLoginButton', { timeout: 5000 });
    if (loginButton) {
      await loginButton.click();
    }
  }

  async addProductToBasket(index) {
    const productSelector = `.mat-grid-tile:nth-child(${index + 1}) button[aria-label="Add to Basket"]`;
    const addToBasketButton = await this.page.waitForSelector(productSelector, { timeout: 5000 });
    if (addToBasketButton) {
      await addToBasketButton.click();
      this.selectMaxPagination
      await this.page.waitForTimeout(2000);
    }
  }

  async verifySuccessPopup() {
    const successPopup = await this.page.waitForSelector('snack-bar-container', { timeout: 5000 });
    expect(successPopup).not.toBeNull();
  }

  async verifyCartItemCount(expectedCount) {
    const cartButton = await this.page.waitForSelector('button[aria-label="Show the shopping cart"] span.fa-layers-counter', { timeout: 5000 });
    const cartItemCount = await cartButton.innerText();
    expect(parseInt(cartItemCount, 10)).toBe(expectedCount);
  }
}

module.exports = JuiceShopPage;