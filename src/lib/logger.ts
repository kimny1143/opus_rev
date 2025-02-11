import { Session } from './auth';

interface LogContext {
  userId?: string;
  action: string;
  target: string;
  status: 'success' | 'error';
  details?: unknown;
}

interface ErrorLogContext extends LogContext {
  error: unknown;
  stack?: string;
}

// ログレベルの定義
export const LogLevel = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
} as const;

type LogLevel = typeof LogLevel[keyof typeof LogLevel];

// ログエントリの整形
function formatLogEntry(
  level: LogLevel,
  context: LogContext | ErrorLogContext,
  session?: Session | null
): string {
  const timestamp = new Date().toISOString();
  const userId = session?.userId || context.userId || 'anonymous';
  
  const baseLog = {
    timestamp,
    level,
    userId,
    ...context,
  };

  // 開発環境では見やすく整形
  if (process.env.NODE_ENV === 'development') {
    return JSON.stringify(baseLog, null, 2);
  }

  // 本番環境ではコンパクトに
  return JSON.stringify(baseLog);
}

// 情報ログ
export function logInfo(context: LogContext, session?: Session | null): void {
  const logEntry = formatLogEntry(LogLevel.INFO, context, session);
  console.log(logEntry);
}

// 警告ログ
export function logWarn(context: LogContext, session?: Session | null): void {
  const logEntry = formatLogEntry(LogLevel.WARN, context, session);
  console.warn(logEntry);
}

// エラーログ
export function logError(context: ErrorLogContext, session?: Session | null): void {
  // エラーオブジェクトのスタックトレースを取得
  if (context.error instanceof Error) {
    context.stack = context.error.stack;
  }

  const logEntry = formatLogEntry(LogLevel.ERROR, context, session);
  console.error(logEntry);

  // 本番環境では外部のログサービスにも送信可能
  if (process.env.NODE_ENV === 'production') {
    // TODO: 外部ログサービスへの送信処理
    // 例: Sentry, LogRocket, Datadog等
  }
} 