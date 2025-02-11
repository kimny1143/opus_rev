# 次のステップ指示書 (案)

## 1. ログの永続化と監査ログ設計
- <need>
  - security-logging-implementation.md で提案されているファイルローテーション案を適用
  - Sentry/Datadogのどちらを使用するか判断し、本番環境のみ有効化
  - 管理者権限の操作や個人情報へのアクセス履歴を保存する「監査ログ」テーブルを設計

- <constraint>
  - MVPスコープなので、過度に複雑なロール管理・ワークフローは導入しない
  - 保存期間などは一旦3ヶ月を目安とし、容量用途に応じて後日議論

- <reference path="docs/implementation/security-guide.md" section="5. 定期的なセキュリティレビュー">
  ログ運用のためのセキュリティレビュー項目を参照
</reference>

## 2. 取引先管理機能のCRUD実装
- <need>
  - 取引先の登録・編集・削除それぞれに対して、Cypress E2Eテストを用意
  - タグ(最大2つ)の付与機能を基本実装
  - 大規模データ処理や複雑検索は対象外

- <constraint>
  - テストフレームワークはCypressのみ
  - test-guide.md のガイドラインを順守
  - デザインはTailwindベースだが、最低限のUI実装で留める

- <reference path="docs/prompt/mvp_instructions.md" section="2. 割り切りと除外内容">
  大規模検索や高度なセキュリティ要件の除外が明記されている
</reference>

## 3. 仕入明細書管理 作成・承認・PDF出力
- <need>
  - MVPに必要なフィールド(ステータス: draft/pending/approved) の実装
  - PDF出力のテンプレート作成 (ヘッダー/フッター/明細)
  - シンプルなCypressテスト: 「ログイン→明細書作成→PDF生成確認」のハッピーパス

- <constraint>
  - 追加のバリデーション、インボイス制対応の拡張は最小限
  - 大量発行ケースのパフォーマンスや複雑な承認ルートは後回し

- <reference path="docs/prompt/req_def.md" section="2.4">
  仕入明細書基本要件を参照
</reference>

## 4. スケジュール
- <context>
  - まずは取引先管理機能(1-2日)
  - 引き続き仕入明細書管理(2-3日)
  - 並行してログ永続化の設定と監査ログの草案づくり(優先度は中)
</context>

---
以上をチームで合意したら、 @implementation 配下の既存ドキュメントに順次追記 or 新規作成してください。  
実装の進捗がまとまったら auth-implementation.md や security-logging-implementation.md と同じ形式の報告書を出しましょう。