import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { validateInput, vendorSchema } from '@/lib/validation';
import { logInfo, logWarn, logError } from '@/lib/logger';

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      logWarn({
        action: 'vendor_list',
        target: 'vendor',
        status: 'error',
        details: '未認証のアクセス',
      });
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }

    // URLSearchParamsからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase();
    const tag = searchParams.get('tag');

    // 検索条件を構築
    const where: Prisma.VendorWhereInput = {
      AND: [
        search
          ? {
              OR: [
                {
                  name: {
                    contains: search,
                    mode: 'insensitive' as Prisma.QueryMode,
                  },
                },
                {
                  email: {
                    contains: search,
                    mode: 'insensitive' as Prisma.QueryMode,
                  },
                },
              ],
            }
          : {},
        tag
          ? {
              tags: {
                has: tag,
              },
            }
          : {},
      ],
    };

    const vendors = await prisma.vendor.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    logInfo({
      action: 'vendor_list',
      target: 'vendor',
      status: 'success',
      details: { search, tag, count: vendors.length },
    }, session);

    return NextResponse.json(vendors);
  } catch (error) {
    logError({
      action: 'vendor_list',
      target: 'vendor',
      status: 'error',
      error,
    });
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session) {
      logWarn({
        action: 'vendor_create',
        target: 'vendor',
        status: 'error',
        details: '未認証のアクセス',
      });
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }

    const body = await request.json();
    
    // 入力バリデーション
    const validationResult = await validateInput(vendorSchema, body);
    if (!validationResult.success) {
      logWarn({
        action: 'vendor_create',
        target: 'vendor',
        status: 'error',
        details: { error: validationResult.error, input: body },
      }, session);
      return new NextResponse(
        JSON.stringify({ error: validationResult.error }),
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.create({
      data: validationResult.data,
    });

    logInfo({
      action: 'vendor_create',
      target: 'vendor',
      status: 'success',
      details: { vendorId: vendor.id },
    }, session);

    return NextResponse.json(vendor);
  } catch (error) {
    logError({
      action: 'vendor_create',
      target: 'vendor',
      status: 'error',
      error,
    });
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 