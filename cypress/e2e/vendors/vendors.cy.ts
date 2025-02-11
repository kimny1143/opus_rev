describe('取引先管理', () => {
  beforeEach(() => {
    cy.login();
  });

  it('取引先一覧を表示できる', () => {
    cy.visit('/dashboard/vendors');
    cy.get('[data-testid="vendors-title"]').should('contain', '取引先一覧');
  });

  it('新規取引先を登録できる', () => {
    cy.visit('/dashboard/vendors');
    cy.get('[data-testid="add-vendor-button"]').click();

    // フォームの入力
    cy.get('[data-testid="vendor-name-input"]').type('テスト取引先');
    cy.get('[data-testid="vendor-email-input"]').type('test@example.com');
    cy.get('[data-testid="vendor-tags-input"]').type('重要,テスト');

    // 送信
    cy.get('[data-testid="submit-vendor"]').click();

    // 一覧に戻り、新規登録した取引先が表示されることを確認
    cy.url().should('include', '/dashboard/vendors');
    cy.contains('テスト取引先').should('exist');
    cy.contains('test@example.com').should('exist');
  });

  it('必須項目が未入力の場合はエラーになる', () => {
    cy.visit('/dashboard/vendors/new');

    // 名前を入力せずにメールアドレスのみ入力
    cy.get('[data-testid="vendor-email-input"]').type('test@example.com');

    // 送信
    cy.get('[data-testid="submit-vendor"]').click();

    // フォームが送信されずに同じページに留まることを確認
    cy.url().should('include', '/dashboard/vendors/new');
  });
}); 