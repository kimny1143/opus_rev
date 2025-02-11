import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { validateInput, vendorSchema } from '@/lib/validation';
import { logInfo, logWarn, logError } from '@/lib/logger';

interface RouteParams {
  params: {
    id: string;
  };
}

// 取引先詳細の取得
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      logWarn({
        action: 'vendor_get',
        target: 'vendor',
        status: 'error',
        details: { vendorId: params.id, reason: '未認証のアクセス' },
      });
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }

    const vendor = await prisma.vendor.findUnique({
      where: { id: params.id },
    });

    if (!vendor) {
      logWarn({
        action: 'vendor_get',
        target: 'vendor',
        status: 'error',
        details: { vendorId: params.id, reason: '取引先が存在しない' },
      }, session);
      return new NextResponse(JSON.stringify({ error: '取引先が見つかりません' }), {
        status: 404,
      });
    }

    logInfo({
      action: 'vendor_get',
      target: 'vendor',
      status: 'success',
      details: { vendorId: vendor.id },
    }, session);

    return NextResponse.json(vendor);
  } catch (error) {
    logError({
      action: 'vendor_get',
      target: 'vendor',
      status: 'error',
      error,
      details: { vendorId: params.id },
    });
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// 取引先情報の更新
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      logWarn({
        action: 'vendor_update',
        target: 'vendor',
        status: 'error',
        details: { vendorId: params.id, reason: '未認証のアクセス' },
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
        action: 'vendor_update',
        target: 'vendor',
        status: 'error',
        details: { vendorId: params.id, error: validationResult.error, input: body },
      }, session);
      return new NextResponse(
        JSON.stringify({ error: validationResult.error }),
        { status: 400 }
      );
    }

    const vendor = await prisma.vendor.update({
      where: { id: params.id },
      data: validationResult.data,
    });

    logInfo({
      action: 'vendor_update',
      target: 'vendor',
      status: 'success',
      details: { vendorId: vendor.id },
    }, session);

    return NextResponse.json(vendor);
  } catch (error) {
    logError({
      action: 'vendor_update',
      target: 'vendor',
      status: 'error',
      error,
      details: { vendorId: params.id },
    });
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}

// 取引先の削除
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const session = await getSession();
    if (!session) {
      logWarn({
        action: 'vendor_delete',
        target: 'vendor',
        status: 'error',
        details: { vendorId: params.id, reason: '未認証のアクセス' },
      });
      return new NextResponse(JSON.stringify({ error: '認証が必要です' }), {
        status: 401,
      });
    }

    await prisma.vendor.delete({
      where: { id: params.id },
    });

    logInfo({
      action: 'vendor_delete',
      target: 'vendor',
      status: 'success',
      details: { vendorId: params.id },
    }, session);

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logError({
      action: 'vendor_delete',
      target: 'vendor',
      status: 'error',
      error,
      details: { vendorId: params.id },
    });
    return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
} 