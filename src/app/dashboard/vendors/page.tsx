'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  email: string;
  tags: string[];
  createdAt: string;
}

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('/api/vendors');
        if (!response.ok) throw new Error('取引先データの取得に失敗しました');
        const data = await response.json();
        setVendors(data);
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold" data-testid="vendors-title">取引先一覧</h1>
              <Link
                href="/dashboard/vendors/new"
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                data-testid="add-vendor-button"
              >
                新規登録
              </Link>
            </div>

            {isLoading ? (
              <div className="text-center py-4">読み込み中...</div>
            ) : vendors.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                取引先が登録されていません
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        取引先名
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        メールアドレス
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        タグ
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        登録日
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        操作
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {vendors.map((vendor) => (
                      <tr key={vendor.id} data-testid={`vendor-row-${vendor.id}`}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vendor.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {vendor.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex gap-2">
                            {vendor.tags.map((tag) => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(vendor.createdAt).toLocaleDateString('ja-JP')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Link
                            href={`/dashboard/vendors/${vendor.id}/edit`}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            編集
                          </Link>
                          <button
                            onClick={() => {/* 削除処理は後で実装 */}}
                            className="text-red-600 hover:text-red-900"
                            data-testid={`delete-vendor-${vendor.id}`}
                          >
                            削除
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 