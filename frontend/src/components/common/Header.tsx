"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Menu,
  X,
  Scale,
  User,
  LogOut,
  ShoppingCart,
} from "lucide-react";
import { Container } from "./Container";

interface HeaderProps {
  user?: { email: string } | null;
  onLogout?: () => void;
  cartItemCount?: number;
}

export function Header({ user, onLogout, cartItemCount = 0 }: HeaderProps = {}) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogoClick = () => {
    router.push('/');
  };

  const handleCartClick = () => {
    router.push('/cart');
  };

  const handleLoginClick = () => {
    router.push('/login');
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer"
            onClick={handleLogoClick}
          >
            <Scale className="size-6 text-blue-600" />
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

        {/* Search Bar */}
        <div className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="간식 이름, 브랜드를 검색하세요"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="border-t border-gray-200 py-4 space-y-2">
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              인기 비교
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              성분 가이드
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              가격 분석
            </a>
            <a
              href="#"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
            >
              리뷰
            </a>
            {user && (
              <div className="border-t border-gray-200 py-2">
                <div className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">
                  <User className="size-5" />
                  <span>{user.email}</span>
                </div>
                <button
                  className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg"
                  onClick={onLogout}
                >
                  <LogOut className="size-5" />
                  로그아웃
                </button>
              </div>
            )}
          </nav>
        )}
      </Container>
    </header>
  );
}
