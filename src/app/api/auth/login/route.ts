import { NextResponse } from 'next/server';

// MVPでは簡易的なユーザー認証を実装
const VALID_CREDENTIALS = {
  email: process.env.TEST_USER_EMAIL || 'test@example.com',
  password: process.env.TEST_USER_PASSWORD || 'password123',
};

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // 認証チェック
    if (
      email === VALID_CREDENTIALS.email &&
      password === VALID_CREDENTIALS.password
    ) {
      // セッションの作成(MVPでは簡易的な実装)
      const sessionToken = Buffer.from(
        `${email}-${Date.now()}`
      ).toString('base64');

      const response = NextResponse.json(
        {
          success: true,
          user: {
            email,
            role: 'user',
          },
        },
        { status: 200 }
      );

      // セッショントークンをクッキーに設定
      response.cookies.set('session-token', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24, // 24時間
        path: '/',
      });

      return response;
    }

    // 認証失敗
    return NextResponse.json(
      {
        success: false,
        error: 'メールアドレスまたはパスワードが正しくありません',
      },
      { status: 401 }
    );
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      {
        success: false,
        error: '認証処理中にエラーが発生しました',
      },
      { status: 500 }
    );
  }
}