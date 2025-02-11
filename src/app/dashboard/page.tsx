'use client';

import { useEffect, type FC } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const DashboardPage: FC = () => {
  const router = useRouter();

  useEffect(() => {
    // セッションの確認
    const checkSession = async () => {
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          // 未認証の場合はログインページにリダイレクト
          router.push('/login');
        }
      } catch {
        router.push('/login');
      }
    };

    checkSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold">OPUS</h1>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={() => router.push('/api/auth/logout')}
                className="ml-4 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                data-testid="logout-button"
              >
                ログアウト
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-4">
            <h1 className="text-2xl font-bold mb-4">ダッシュボード</h1>
            <nav className="space-y-4">
              <Link 
                href="/dashboard/vendors" 
                className="block p-4 bg-white shadow rounded-lg hover:bg-gray-50"
              >
                取引先管理
              </Link>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;