# セキュリティガイドライン

本ドキュメントは、OPUSプロジェクトにおけるセキュリティ関連の設定や運用手順をまとめたものです。

## 1. 環境変数とシークレット

### JWT_SECRET の生成
1. 安全なランダム値の生成方法
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   - 64バイト（128文字）のランダムな16進数文字列を生成
   - Node.jsの`crypto`モジュールを使用し、暗号学的に安全な乱数を生成

2. 環境ごとの設定
   - 開発環境（.env.development）
   - テスト環境（.env.test）
   - ステージング環境（.env.staging）
   - 本番環境（.env.production）
   
   各環境で異なるJWT_SECRETを使用し、環境間での分離を確実にします。

3. シークレットの共有方法
   - 開発チーム内での共有はパスワードマネージャーを使用
   - 本番環境の値は特定の管理者のみがアクセス可能
   - `.env`ファイルは決してGitリポジトリにコミットしない

### データベース接続情報
1. DATABASE_URLの形式
   ```
   postgresql://${USER}:${PASSWORD}@${HOST}:${PORT}/${DATABASE}?schema=public
   ```

2. パスワード要件
   - 最低16文字以上
   - 大文字・小文字・数字・記号を含む
   - 定期的な更新（3ヶ月ごと）

## 2. 認証・認可

### セッション管理
1. JWTトークン
   - 有効期限: 24時間
   - リフレッシュトークンの実装（予定）

2. セキュリティヘッダー
   ```typescript
   // 実装例
   res.setHeader('X-Frame-Options', 'DENY');
   res.setHeader('X-Content-Type-Options', 'nosniff');
   res.setHeader('Referrer-Policy', 'same-origin');
   ```

### CORS設定
```typescript
// 実装例
export const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};
```

## 3. 入力検証とサニタイゼーション

1. バリデーションルール
   - メールアドレス: RFC 5322準拠
   - パスワード: 最低8文字、英数字記号混在
   - ユーザー入力: XSS対策のエスケープ処理

2. 実装例
   ```typescript
   // メールアドレスバリデーション
   const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
   
   // パスワードバリデーション
   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
   ```

## 4. エラーハンドリング

1. セキュリティ関連のエラー
   - 詳細なエラーメッセージは本番環境では表示しない
   - ログは適切にサニタイズして保存

2. 実装例
   ```typescript
   try {
     // 処理
   } catch (error) {
     // 開発環境でのみ詳細を表示
     if (process.env.NODE_ENV === 'development') {
       console.error('Detailed error:', error);
     }
     // 本番環境では一般的なメッセージを返す
     return new Error('認証に失敗しました');
   }
   ```

## 5. 定期的なセキュリティレビュー

1. レビュー項目
   - 依存パッケージの脆弱性チェック（毎週）
   - 環境変数とシークレットの更新（3ヶ月ごと）
   - セキュリティヘッダーの設定確認（毎月）
   - アクセスログの監査（毎週）

2. 実行コマンド
   ```bash
   # 依存パッケージの脆弱性チェック
   npm audit
   
   # TypeScriptの型チェック
   npm run type-check
   
   # ESLintセキュリティルールチェック
   npm run lint
   ```

---

本ドキュメントは定期的に更新され、チーム全体で共有・遵守されます。
セキュリティに関する質問や懸念がある場合は、すぐにチームリーダーに報告してください。 