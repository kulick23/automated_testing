import { test, expect } from '@playwright/test';

const appUrl = 'https://www.saucedemo.com/';
const validUsername = 'standard_user';
const validPassword = 'secret_sauce';
const invalidUsername = 'standard_user_123';
const invalidPassword = 'secret_sauce_123';

test.describe('SauceDemo Tests', () => {

  test('Test Case 1: Verify User Login', async ({ page }) => {
    await page.goto(appUrl);
    await page.fill('input[data-test="username"]', validUsername);
    await page.fill('input[data-test="password"]', validPassword);
    await page.click('input[data-test="login-button"]');
    const appLogo = await page.textContent('.app_logo');
    expect(appLogo).toBe('Swag Labs');
  });

  test('Test Case 2: Verify Adding Item to Cart', async ({ page }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    const cartBadge = await page.textContent('.shopping_cart_badge');
    expect(cartBadge).toBe('1');
    await page.click('.shopping_cart_link');
    const cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(1);
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');
  });

  test('Test Case 3: Verify Adding Multiple Items to Cart', async ({ page }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    let cartBadge = await page.textContent('.shopping_cart_badge');
    expect(cartBadge).toBe('1');
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    cartBadge = await page.textContent('.shopping_cart_badge');
    expect(cartBadge).toBe('2');
    await page.click('.shopping_cart_link');
    const cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(2);
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
  });

  test('Test Case 4: Verify Removing Item from Cart', async ({ page }) => {
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    let cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(1);
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await page.click('button[data-test="remove-sauce-labs-backpack"]');
    cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(0);
    const cartBadge = await page.$('.shopping_cart_badge');
    expect(cartBadge).toBeNull();
  });

  test('Test Case 5: Verify Checkout Process', async ({ page }) => {
    await addItemToCart(page, 'sauce-labs-backpack');
    await page.click('.shopping_cart_link');
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText('Sauce Labs Backpack');
    await page.click('button[data-test="checkout"]');
    await page.fill('input[data-test="firstName"]', 'John');
    await page.fill('input[data-test="lastName"]', 'Dou');
    await page.fill('input[data-test="postalCode"]', '12345');
    await page.click('input[data-test="continue"]');
    const summaryTotal = await page.textContent('.summary_total_label');
    expect(summaryTotal).toBe('Total: $32.39');
    await page.click('button[data-test="finish"]');
    const completeHeader = await page.textContent('.complete-header');
    expect(completeHeader).toBe('Thank you for your order!');
  });
  
  test('Test Case 6: Verify Checkout Process for Multiple Items', async ({ page }) => {
    await login(page);
    await page.click('button[data-test="add-to-cart-sauce-labs-backpack"]');
    let cartBadge = await page.textContent('.shopping_cart_badge');
    expect(cartBadge).toBe('1');
    await page.click('button[data-test="add-to-cart-sauce-labs-bike-light"]');
    cartBadge = await page.textContent('.shopping_cart_badge');
    expect(cartBadge).toBe('2');
    await page.click('.shopping_cart_link');
    const cartItems = await page.$$('.cart_item');
    expect(cartItems.length).toBe(2);
    await expect(page.locator('.cart_item .inventory_item_name')).toHaveText(['Sauce Labs Backpack', 'Sauce Labs Bike Light']);
    await page.click('button[data-test="checkout"]');
    await page.fill('input[data-test="firstName"]', 'John');
    await page.fill('input[data-test="lastName"]', 'Dou');
    await page.fill('input[data-test="postalCode"]', '12345');
    await page.click('input[data-test="continue"]');
    const summaryTotal = await page.textContent('.summary_total_label');
    expect(summaryTotal).toBe('Total: $43.18');
    await page.click('button[data-test="finish"]');
    const completeHeader = await page.textContent('.complete-header');
    expect(completeHeader).toBe('Thank you for your order!');
  });
  
  test('Test Case 7: Verify Non-Existing User Is not Able to Login', async ({ page }) => {
    await page.goto(appUrl);
    await page.fill('input[data-test="username"]', invalidUsername);
    await page.fill('input[data-test="password"]', invalidPassword);
    await page.click('input[data-test="login-button"]');
    const errorMessage = await page.textContent('h3[data-test="error"]');
    expect(errorMessage).toBe('Epic sadface: Username and password do not match any user in this service');
    const isErrorVisible = await page.isVisible('h3[data-test="error"]');
    expect(isErrorVisible).toBeTruthy();
  });

  test('Test Case 8: Verify User is able to logout', async ({ page }) => {
    await login(page);
    await page.click('button#react-burger-menu-btn');
    await expect(page.locator('#shopping_cart_container')).toBeVisible();
    await page.click('#logout_sidebar_link');
    await expect(page.locator('input[data-test="username"]')).toBeVisible();
    await expect(page.locator('input[data-test="password"]')).toBeVisible();
    await expect(page.locator('input[data-test="login-button"]')).toBeVisible();
  });

});

async function login(page) {
  await page.goto(appUrl);
  await page.fill('input[data-test="username"]', validUsername);
  await page.fill('input[data-test="password"]', validPassword);
  await page.click('input[data-test="login-button"]');
}

async function addItemToCart(page, item) {
  await login(page);
  await page.click(`button[data-test="add-to-cart-${item}"]`);
}