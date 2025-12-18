'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Package, 
  Plus, 
  ShoppingCart, 
  Users, 
  TrendingUp,
  LogOut
} from 'lucide-react';

export function AdminDashboard() {
  const router = useRouter();

  const handleLogout = () => {
    // TODO: API 호출
    // await authService.logout();
    router.push('/admin/login');
  };

  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // 임시 통계 데이터
  const stats = {
    totalProducts: 156,
    totalOrders: 89,
    totalUsers: 1234,
    totalRevenue: 15680000,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl text-gray-900">관리자 대시보드</h1>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            <LogOut className="size-5" />
            로그아웃
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* 통계 카드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 상품</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.totalProducts}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="size-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 주문</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.totalOrders}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ShoppingCart className="size-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 사용자</p>
                <p className="text-2xl text-gray-900 mt-1">{stats.totalUsers}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="size-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">총 매출</p>
                <p className="text-2xl text-gray-900 mt-1">
                  {(stats.totalRevenue / 10000).toFixed(0)}만원
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <TrendingUp className="size-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 빠른 액션 */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-lg text-gray-900 mb-4">빠른 작업</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => handleNavigate('/admin/products/new')}
              className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Plus className="size-5 text-gray-600" />
              <span className="text-gray-700">새 상품 등록</span>
            </button>

            <button
              onClick={() => handleNavigate('/admin/products')}
              className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <Package className="size-5 text-gray-600" />
              <span className="text-gray-700">상품 관리</span>
            </button>

            <button
              onClick={() => handleNavigate('/admin/orders')}
              className="flex items-center justify-center gap-3 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all"
            >
              <ShoppingCart className="size-5 text-gray-600" />
              <span className="text-gray-700">주문 관리</span>
            </button>
          </div>
        </div>

        {/* 최근 활동 (임시) */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg text-gray-900 mb-4">최근 활동</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-900">새로운 주문</p>
                <p className="text-xs text-gray-500">5분 전</p>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded">
                주문 #89
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-900">상품 재고 부족</p>
                <p className="text-xs text-gray-500">1시간 전</p>
              </div>
              <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded">
                닭가슴살 큐브
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-900">새로운 리뷰</p>
                <p className="text-xs text-gray-500">2시간 전</p>
              </div>
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                ★★★★★
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}