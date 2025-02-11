/// <reference types="cypress" />

// カスタムコマンドの型定義を拡張
export {};
declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * カスタムコマンド: ログイン
       * @example cy.login('test@example.com', 'password123')
       */
      login(email?: string, password?: string): Chainable<void>;

      /**
       * カスタムコマンド: ログアウト
       * @example cy.logout()
       */
      logout(): Chainable<void>;
    }
  }
}

// ログインコマンド
Cypress.Commands.add('login', (email = 'test@example.com', password = 'password123') => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[data-testid="email-input"]').type(email);
    cy.get('[data-testid="password-input"]').type(password);
    cy.get('[data-testid="login-button"]').click();
    cy.url().should('include', '/dashboard');
  });
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