import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimit } from './lib/rate-limit';

export async function middleware(request: NextRequest) {
  // APIエンドポイントに対してレート制限を適用
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0] : 'unknown';
    const endpoint = request.nextUrl.pathname;
    
    const rateLimitResult = await rateLimit(request, { ip, endpoint });
    if (rateLimitResult) return rateLimitResult;
  }

  // レスポンスの作成
  const response = NextResponse.next();

  // セキュリティヘッダーの設定
  const headers = response.headers;

  // XSS対策
  headers.set('X-XSS-Protection', '1; mode=block');
  
  // クリックジャッキング対策
  headers.set('X-Frame-Options', 'DENY');
  
  // MIMEタイプスニッフィング対策
  headers.set('X-Content-Type-Options', 'nosniff');
  
  // Referrer Policy
  headers.set('Referrer-Policy', 'same-origin');
  
  // Content Security Policy
  headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob:",
      "font-src 'self'",
      "connect-src 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  );

  // Strict Transport Security
  if (process.env.NODE_ENV === 'production') {
    headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }

  // CORS設定
  const origin = request.headers.get('origin');
  const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');

  if (origin && (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development')) {
    headers.set('Access-Control-Allow-Origin', origin);
    headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    headers.set('Access-Control-Allow-Credentials', 'true');
    
    // プリフライトリクエストの有効期限
    headers.set('Access-Control-Max-Age', '86400');
  }

  return response;
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    // APIルート
    '/api/:path*',
    // アプリケーションページ
    '/((?!_next/static|favicon.ico).*)',
  ],
}; 