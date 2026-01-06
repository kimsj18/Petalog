"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Menu,
  X,
  User,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";

export function Header() {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const loadCart = useCartStore((state) => state.loadCart);
  const cartItemCount = cartItems.length; // 상품 종류 수

  // 인증 상태가 변경될 때 장바구니 로드
  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    }
  }, [isAuthenticated, loadCart]);

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <header className="bg-white sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 border-b border-gray-200">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            {/*<Scale className="size-6 text-blue-600" />*/}
            <h1 className="text-blue-600">펫탈로그</h1>
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative"
              onClick={handleCartClick}
            >
              <ShoppingCart className="size-5 text-gray-700" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                  {cartItemCount}
                </span>
              )}
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="size-5 text-gray-700" />
              ) : (
                <Menu className="size-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="border-t border-gray-200 py-4 space-y-2">
            <a
              href="../../user/mypage"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              마이페이지
            </a>
            {/*<a*/}
            {/*  href="#"*/}
            {/*  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"*/}
            {/*>*/}
            {/*  성분 가이드*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  href="#"*/}
            {/*  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"*/}
            {/*>*/}
            {/*  가격 분석*/}
            {/*</a>*/}
            {/*<a*/}
            {/*  href="#"*/}
            {/*  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"*/}
            {/*>*/}
            {/*  리뷰*/}
            {/*</a>*/}
            {isAuthenticated && user && (
              <div className="border-t border-gray-200 py-2">
                <div className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <User className="size-5" />
                  <span>{user.user_email}</span>
                </div>
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={handleLogout}
                >
                  <LogOut className="size-5" />
                  로그아웃
                </button>
              </div>
            )}
            {!isAuthenticated && (
              <button
                className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                onClick={handleLoginClick}
              >
                <User className="size-5" />
                로그인
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}
