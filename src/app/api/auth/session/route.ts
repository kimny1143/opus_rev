import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get('cookie') || '';
    const hasSessionToken = cookieHeader.includes('session-token=');

    if (!hasSessionToken) {
      return NextResponse.json(
        {
          success: false,
          error: '未認証のセッション',
        },
        { status: 401 }
      );
    }

    // MVPでは簡易的なセッション確認のみ
    return NextResponse.json(
      {
        success: true,
        user: {
          email: process.env.TEST_USER_EMAIL || 'test@example.com',
          role: 'user',
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Session check error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'セッション確認中にエラーが発生しました',
      },
      { status: 500 }
    );
  }
}