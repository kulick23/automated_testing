import { test, expect } from '@playwright/test';
import { LoginPage } from './pageObjects/LoginPage';
import { InventoryPage } from './pageObjects/InventoryPage';
import { CartPage } from './pageObjects/CartPage';

const appUrl = 'https://www.saucedemo.com/';
const validUsername = 'standard_user';
const validPassword = 'secret_sauce';

test.describe('SauceDemo Tests', () => {
  test('Test Case 1: Verify User Login', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto(appUrl);
    await loginPage.login(validUsername, validPassword);
    const appLogo = await page.textContent('.app_logo');
    expect(appLogo).toBe('Swag Labs');
  });

  test('Test Case 2: Verify Adding Item to Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto(appUrl);
    await loginPage.login(validUsername, validPassword);
    await inventoryPage.addItem('sauce-labs-backpack');
    expect(await inventoryPage.getCartCount()).toBe('1');
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(1);
  });

  test('Test Case 4: Verify Removing Item from Cart', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto(appUrl);
    await loginPage.login(validUsername, validPassword);
    await inventoryPage.addItem('sauce-labs-backpack');
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(1);
    await cartPage.removeItem('sauce-labs-backpack');
    expect(await cartPage.getItemCount()).toBe(0);
  });

  test('Test Case 5: Verify Checkout Process', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto(appUrl);
    await loginPage.login(validUsername, validPassword);
    await inventoryPage.addItem('sauce-labs-backpack');
    await inventoryPage.openCart();
    expect(await cartPage.getItemCount()).toBe(1);
    await cartPage.checkout('John', 'Dou', '12345');
    const summaryTotal = await page.textContent('.summary_total_label');
    expect(summaryTotal).toBe('Total: $32.39');
    await page.click('button[data-test="finish"]');
    const completeHeader = await page.textContent('.complete-header');
    expect(completeHeader).toBe('Thank you for your order!');
  });
});