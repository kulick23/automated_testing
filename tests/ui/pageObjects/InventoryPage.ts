export class InventoryPage {
    constructor(private page) {}
  
    async addItem(productName: string) {
      await this.page.click(`button[data-test="add-to-cart-${productName}"]`);
    }
  
    async openCart() {
      await this.page.click('.shopping_cart_link');
    }
  
    async getCartCount() {
      return this.page.textContent('.shopping_cart_badge');
    }
  }