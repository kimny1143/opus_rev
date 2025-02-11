describe('ログインフロー', () => {
  beforeEach(() => {
    // 各テストの前にログインページにアクセス
    cy.visit('/login');
  });

  it('正しいメールとパスワードでログインできる', () => {
    // 環境変数からテストユーザー情報を取得
    const email = Cypress.env('TEST_USER_EMAIL');
    const password = Cypress.env('TEST_USER_PASSWORD');

    // メールアドレスとパスワードを入力
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type(password);

    // ログインボタンをクリック
    cy.get('button[type="submit"]').click();

    // ダッシュボードにリダイレクトされることを確認
    cy.url().should('include', '/dashboard');
    
    // ダッシュボードのコンテンツが表示されることを確認
    cy.get('[data-testid="dashboard-title"]').should('exist');
  });

  it('誤ったパスワードではログインできない', () => {
    const email = Cypress.env('TEST_USER_EMAIL');
    
    // メールアドレスと誤ったパスワードを入力
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type('wrong_password');

    // ログインボタンをクリック
    cy.get('button[type="submit"]').click();

    // エラーメッセージが表示されることを確認
    cy.get('[data-testid="error-message"]')
      .should('exist')
      .and('contain', 'メールアドレスまたはパスワードが正しくありません');

    // URLが/loginのままであることを確認
    cy.url().should('include', '/login');
  });

  it('必須フィールドの入力チェック', () => {
    // 空の状態でログインボタンをクリック
    cy.get('button[type="submit"]').click();

    // メールアドレスの入力エラーを確認
    cy.get('[data-testid="email-error"]')
      .should('exist')
      .and('contain', 'メールアドレスを入力してください');

    // パスワードの入力エラーを確認
    cy.get('[data-testid="password-error"]')
      .should('exist')
      .and('contain', 'パスワードを入力してください');
  });
});