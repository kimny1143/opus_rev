'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Vendor {
  id: string;
  name: string;
  email: string;
  tags: string[];
  createdAt: string;
}

export default function VendorsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedTag, setSelectedTag] = useState(searchParams.get('tag') || '');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const params = new URLSearchParams();
        if (searchTerm) params.set('search', searchTerm);
        if (selectedTag) params.set('tag', selectedTag);

        const response = await fetch(`/api/vendors?${params.toString()}`);
        if (!response.ok) throw new Error('取引先データの取得に失敗しました');
        const data = await response.json();
        setVendors(data);

        // タグの一覧を収集
        const tags = new Set<string>();
        data.forEach((vendor: Vendor) => {
          vendor.tags.forEach(tag => tags.add(tag));
        });
        setAllTags(Array.from(tags).sort());
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [searchTerm, selectedTag]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set('search', value);
    } else {
      params.delete('search');
    }
    router.push(`/dashboard/vendors?${params.toString()}`);
  };

  const handleTagFilter = (tag: string) => {
    setSelectedTag(tag);
    const params = new URLSearchParams(searchParams);
    if (tag) {
      params.set('tag', tag);
    } else {
      params.delete('tag');
    }
    router.push(`/dashboard/vendors?${params.toString()}`);
  };

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

            <div className="mb-6 space-y-4">
              <div>
                <label htmlFor="search" className="block text-sm font-medium text-gray-700">
                  検索
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="取引先名またはメールアドレスで検索"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  data-testid="vendor-search-input"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  タグでフィルター
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTagFilter('')}
                    className={`px-3 py-1 rounded-full text-sm ${
                      selectedTag === ''
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                    }`}
                    data-testid="tag-filter-all"
                  >
                    すべて
                  </button>
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedTag === tag
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                      data-testid={`tag-filter-${tag}`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
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