export class CartPage {
    constructor(private page) {}
  
    async getItemCount() {
      const items = await this.page.$$('.cart_item');
      return items.length;
    }
  
    async removeItem(productName: string) {
      await this.page.click(`button[data-test="remove-${productName}"]`);
    }
  
    async checkout(firstName: string, lastName: string, postalCode: string) {
      await this.page.click('button[data-test="checkout"]');
      await this.page.fill('input[data-test="firstName"]', firstName);
      await this.page.fill('input[data-test="lastName"]', lastName);
      await this.page.fill('input[data-test="postalCode"]', postalCode);
      await this.page.click('input[data-test="continue"]');
    }
  }