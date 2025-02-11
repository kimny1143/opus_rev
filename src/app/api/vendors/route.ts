import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }

    const vendors = await prisma.vendor.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(vendors);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }

    const body = await request.json();
    const { name, email, tags } = body;

    if (!name || !email) {
      return new NextResponse(
        JSON.stringify({ error: '取引先名とメールアドレスは必須です' }),
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: {
        name,
        email,
        tags: tags || [],
      },
    });

    return NextResponse.json(vendor);
  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 