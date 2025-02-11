import { z } from 'zod';

// ベンダー関連のバリデーションスキーマ
export const vendorSchema = z.object({
  name: z
    .string()
    .min(1, '取引先名は必須です')
    .max(100, '取引先名は100文字以内で入力してください'),
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  tags: z
    .array(z.string().max(50, 'タグは50文字以内で入力してください'))
    .default([])
    .transform((tags: string[]) => tags.map((tag: string) => tag.trim()).filter(Boolean)),
});

// ログイン関連のバリデーションスキーマ
export const loginSchema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(100, 'パスワードは100文字以内で入力してください')
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]/,
      'パスワードは英字、数字、特殊文字を含める必要があります'
    ),
});

// バリデーション用のユーティリティ関数
export async function validateInput<T>(
  schema: z.ZodType<T>,
  data: unknown
): Promise<{ success: true; data: T } | { success: false; error: string }> {
  try {
    const validatedData = await schema.parseAsync(data);
    return { success: true, data: validatedData };
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }
    return { success: false, error: '入力データの検証に失敗しました' };
  }
} 