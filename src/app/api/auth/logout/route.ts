import { NextResponse } from 'next/server';

export async function GET() {
  // ログアウト用のレスポンスを作成
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'));

  // セッショントークンを削除
  response.cookies.delete({
    name: 'session-token',
    path: '/',
  });

  return response;
}