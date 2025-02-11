import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface RateLimitContext {
  ip: string;
  endpoint: string;
}

// インメモリストレージ（開発用）
const rateLimitStore = new Map<string, { count: number; timestamp: number }>();

// レート制限のデフォルト設定
const DEFAULT_RATE_LIMIT = {
  windowMs: 60 * 1000, // 1分
  max: 60, // リクエスト数
};

export async function rateLimit(
  request: NextRequest,
  context: RateLimitContext
): Promise<NextResponse | null> {
  const key = `${context.ip}-${context.endpoint}`;
  const now = Date.now();

  // 現在のレート制限状態を取得
  const current = rateLimitStore.get(key) || { count: 0, timestamp: now };

  // タイムウィンドウをリセット
  if (now - current.timestamp > DEFAULT_RATE_LIMIT.windowMs) {
    current.count = 0;
    current.timestamp = now;
  }

  // レート制限チェック
  if (current.count >= DEFAULT_RATE_LIMIT.max) {
    return new NextResponse(
      JSON.stringify({
        error: 'リクエスト制限を超過しました。しばらく待ってから再試行してください。',
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': `${Math.ceil(
            (current.timestamp + DEFAULT_RATE_LIMIT.windowMs - now) / 1000
          )}`,
        },
      }
    );
  }

  // カウンターを更新
  current.count++;
  rateLimitStore.set(key, current);

  return null;
} 