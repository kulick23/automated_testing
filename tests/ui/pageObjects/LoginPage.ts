export class LoginPage {
    constructor(private page) {}
  
    async goto(appUrl: string) {
      await this.page.goto(appUrl);
    }
  
    async login(username: string, password: string) {
      await this.page.fill('input[data-test="username"]', username);
      await this.page.fill('input[data-test="password"]', password);
      await this.page.click('input[data-test="login-button"]');
    }
  }