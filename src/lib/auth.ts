import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface Session {
  userId: string;
  email: string;
  role: string;
}

export async function getSession(): Promise<Session | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('session-token');

    if (!token) {
      return null;
    }

    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(JWT_SECRET)
    );

    return {
      userId: payload.sub as string,
      email: payload.email as string,
      role: payload.role as string,
    };
  } catch (error) {
    console.error('Session verification failed:', error);
    return null;
  }
} 