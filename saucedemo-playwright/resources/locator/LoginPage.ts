import { Page } from '@playwright/test';

export const LoginPage = {
  async goto(page: Page, url: string) {
    await page.goto(url);
  },

  async login(page: Page, username: string, password: string) {
    await page.fill('#user-name', username);
    await page.fill('#password', password);
    await page.click('#login-button');
  },
};
