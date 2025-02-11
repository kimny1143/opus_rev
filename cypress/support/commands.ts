/// <reference types="cypress" />

// カスタムコマンドの型定義を拡張
export {};
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * カスタムコマンド: ログイン
       * @example cy.login('test@example.com', 'password123')
       */
      login(email: string, password: string): Chainable<void>;

      /**
       * カスタムコマンド: ログアウト
       * @example cy.logout()
       */
      logout(): Chainable<void>;
    }
  }
}

// ログインコマンド
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('[name="email"]').type(email);
  cy.get('[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  // ログイン後のリダイレクトを待機
  cy.url().should('include', '/dashboard');
});

// ログアウトコマンド
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  // ログアウト後のリダイレクトを待機
  cy.url().should('include', '/login');
});

// テスト用のインターセプトを設定
beforeEach(() => {
  // APIリクエストのインターセプト
  cy.intercept('POST', '/api/auth/login', (req) => {
    // テストユーザーの場合は成功レスポンス
    if (
      req.body.email === Cypress.env('TEST_USER_EMAIL') &&
      req.body.password === Cypress.env('TEST_USER_PASSWORD')
    ) {
      req.reply({
        statusCode: 200,
        body: {
          token: 'test-token',
          user: {
            id: '1',
            email: Cypress.env('TEST_USER_EMAIL'),
            role: 'user'
          }
        }
      });
    } else {
      // それ以外は認証エラー
      req.reply({
        statusCode: 401,
        body: {
          error: 'メールアドレスまたはパスワードが正しくありません'
        }
      });
    }
  });
});