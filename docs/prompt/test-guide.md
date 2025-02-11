# テストガイド [Cypress限定版]

本ガイドでは、Cypressを用いたテスト実装・運用方法を解説する。  
単体テストからE2Eテストまで含め、原則すべてCypressを利用する想定。

## 1. テストフレームワーク構成

- メインのテストランナー: **Cypress**  
  - E2EテストやUIテストに加えて、Component Testingモードも活用可能。
- 他のテストフレームワーク (Jest, Vitest など) は一切使用しない。

## 2. テストの種類と役割

### 2.1 コンポーネントテスト (Cypress Component Testing)

- 個々のReactコンポーネントを Cypress の Component Testing 機能で検証。  
- 画面要素の描画、ユーザー操作、イベント発火をシミュレートして期待値を確認する。

例:
javascript
// 例: cypress/component/MyButton.cy.js
import MyButton from "@/components/MyButton";
describe("MyButton Component", () => {
it("ボタン内テキストを表示できる", () => {
cy.mount(<MyButton>クリック</MyButton>);
cy.contains("クリック").should("exist");
});
});

### 2.2 E2Eテスト (Cypress)

- ユーザーフロー全体を検証し、画面遷移や入力フォーム、API連携を確認。
- 画面表示 → 入力 → 提交 → 結果確認、の一連を自動化。

例:
javascript
// 例: cypress/e2e/login.cy.js
describe("ログインフロー", () => {
it("正しいメールとパスワードでログインできる", () => {
cy.visit("/login");
cy.get("[name='email']").type("test@example.com");
cy.get("[name='password']").type("password123");
cy.get("button[type='submit']").click();
cy.url().should("include", "/dashboard");
});
});

## 3. テストデータの管理

- テスト用のモックデータやAPIスタブは `cypress/fixtures/` に配置するか、`cy.intercept()` を活用して動的に組み立てる。
- データ量が多い場合はJSONファイルへ切り出し、読み込んで使用すると便利。

## 4. テスト実行環境

- **.env.test** などのテスト専用ファイルを用意し、Cypress実行時は `NODE_ENV=test` で読み込む。
- CI環境でも同じ設定を適用し、保守しやすい運用を行う。

### 4.1 実行コマンド例
bash
E2Eテスト (Cypress, ヘッドレス実行)
npx cypress run
E2Eテスト (Cypress, GUI実行)
npx cypress open
コンポーネントテスト (Cypress Component Testing)
npx cypress open-ct

## 5. テスト作成ガイドライン

1. **ファイル構成**  
   - E2Eテスト: `cypress/e2e/*.cy.{js,ts}`  
   - コンポーネントテスト: `cypress/component/*.cy.{js,ts}`  
2. **命名規則**  
   - テスト内容を日本語で明確に記述 (it() のタイトルなど)  
3. **スクリーンショット/ビデオ**  
   - `cypress/screenshots` / `cypress/videos` に自動保存されるように設定  
4. **APIモック/スタブ**  
   - `cy.intercept()` を有効活用し、外部サービスへの依存を最小化  
5. **CIとの連携**  
   - GitHub Actionsなどを使用し、プルリクエストごとに自動実行  
   - 並列実行やキャッシュ活用などはプロジェクト規模に合わせて調整

以上が、Cypressのみに統一したテストガイドだよ。  
単純なユニットテストでもCypress Component Testingを用いれば済むので、別のフレームワークは不要。  
デバッグやメンテナンスを簡潔にして、開発チーム全体の生産性を高めよう！
