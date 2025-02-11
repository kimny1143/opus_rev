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

  it('取引先情報を編集できる', () => {
    // 事前に取引先を作成
    cy.visit('/dashboard/vendors');
    cy.get('[data-testid="add-vendor-button"]').click();
    cy.get('[data-testid="vendor-name-input"]').type('編集用取引先');
    cy.get('[data-testid="vendor-email-input"]').type('edit@example.com');
    cy.get('[data-testid="submit-vendor"]').click();

    // 編集画面に遷移
    cy.contains('編集用取引先')
      .parent()
      .parent()
      .find('a')
      .contains('編集')
      .click();

    // フォームの編集
    cy.get('[data-testid="vendor-name-input"]')
      .clear()
      .type('編集後の取引先名');
    cy.get('[data-testid="vendor-email-input"]')
      .clear()
      .type('edited@example.com');
    cy.get('[data-testid="vendor-tags-input"]')
      .clear()
      .type('更新,テスト完了');

    // 更新を実行
    cy.get('[data-testid="submit-vendor"]').click();

    // 一覧に戻り、更新された情報が表示されることを確認
    cy.url().should('include', '/dashboard/vendors');
    cy.contains('編集後の取引先名').should('exist');
    cy.contains('edited@example.com').should('exist');
  });

  it('取引先を削除できる', () => {
    // 事前に取引先を作成
    cy.visit('/dashboard/vendors');
    cy.get('[data-testid="add-vendor-button"]').click();
    cy.get('[data-testid="vendor-name-input"]').type('削除用取引先');
    cy.get('[data-testid="vendor-email-input"]').type('delete@example.com');
    cy.get('[data-testid="submit-vendor"]').click();

    // 編集画面に遷移
    cy.contains('削除用取引先')
      .parent()
      .parent()
      .find('a')
      .contains('編集')
      .click();

    // 削除を実行（確認ダイアログはスタブ化）
    cy.window().then((win) => {
      cy.stub(win, 'confirm').returns(true);
    });
    cy.get('[data-testid="delete-vendor-button"]').click();

    // 一覧に戻り、削除した取引先が表示されないことを確認
    cy.url().should('include', '/dashboard/vendors');
    cy.contains('削除用取引先').should('not.exist');
    cy.contains('delete@example.com').should('not.exist');
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

  describe('フィルタリング機能', () => {
    beforeEach(() => {
      // テストデータの作成
      cy.visit('/dashboard/vendors');
      
      // 1件目の取引先
      cy.get('[data-testid="add-vendor-button"]').click();
      cy.get('[data-testid="vendor-name-input"]').type('テスト会社A');
      cy.get('[data-testid="vendor-email-input"]').type('a@example.com');
      cy.get('[data-testid="vendor-tags-input"]').type('重要,VIP');
      cy.get('[data-testid="submit-vendor"]').click();

      // 2件目の取引先
      cy.get('[data-testid="add-vendor-button"]').click();
      cy.get('[data-testid="vendor-name-input"]').type('テスト会社B');
      cy.get('[data-testid="vendor-email-input"]').type('b@example.com');
      cy.get('[data-testid="vendor-tags-input"]').type('一般');
      cy.get('[data-testid="submit-vendor"]').click();
    });

    it('取引先名で検索できる', () => {
      cy.get('[data-testid="vendor-search-input"]').type('会社A');
      cy.contains('テスト会社A').should('exist');
      cy.contains('テスト会社B').should('not.exist');
    });

    it('メールアドレスで検索できる', () => {
      cy.get('[data-testid="vendor-search-input"]').type('b@example');
      cy.contains('テスト会社A').should('not.exist');
      cy.contains('テスト会社B').should('exist');
    });

    it('タグでフィルタリングできる', () => {
      cy.get('[data-testid="tag-filter-重要"]').click();
      cy.contains('テスト会社A').should('exist');
      cy.contains('テスト会社B').should('not.exist');

      cy.get('[data-testid="tag-filter-一般"]').click();
      cy.contains('テスト会社A').should('not.exist');
      cy.contains('テスト会社B').should('exist');
    });

    it('検索とタグフィルターを組み合わせて使用できる', () => {
      cy.get('[data-testid="vendor-search-input"]').type('テスト');
      cy.get('[data-testid="tag-filter-重要"]').click();
      cy.contains('テスト会社A').should('exist');
      cy.contains('テスト会社B').should('not.exist');
    });
  });
}); 