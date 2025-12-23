'use client';

import React, { useState } from 'react';
import { Mail, Lock, AlertCircle, ArrowLeft, Shield } from 'lucide-react';
import {useRouter} from "next/navigation";

interface AdminLoginPageProps {
  onLogin: (email: string) => void;
  onSwitchToUserLogin: () => void;
}

export function AdminLoginPage({ onLogin, onSwitchToUserLogin }: AdminLoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // 유효성 검사
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (!email.includes('@')) {
      setError('올바른 이메일 주소를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('비밀번호는 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    // TODO: 실제 관리자 로그인 API 호출
    // import { login } from '../services/auth';
    // const response = await login({ email, password });
    // if (response.success && response.data?.user.isAdmin) {
    //   onLogin(email);
    // } else {
    //   setError('관리자 권한이 없습니다.');
    // }

    // Mock 처리 - 관리자 계정 체크
    setTimeout(() => {
      if (email === 'admin@dogsnack.com' && password === 'admin123') {
        console.log('관리자 로그인 성공:', email);
        // onLogin(email);
        router.push('/admin');
      } else {
        setError('이메일 또는 비밀번호가 올바르지 않습니다.');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 뒤로가기 버튼 */}
        <button
          onClick={onSwitchToUserLogin}
          className="mb-6 flex items-center gap-2 text-blue-200 hover:text-white transition-colors"
          disabled={isLoading}
        >
          <ArrowLeft className="size-5" />
          <span className="text-sm">일반 로그인으로 돌아가기</span>
        </button>

        {/* 로고 */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <Shield className="size-8 text-white" />
          </div>
          <h1 className="text-white text-3xl mb-2">관리자 로그인</h1>
          <p className="text-blue-200">멍간식 관리 시스템</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl text-gray-900 mb-2">Admin Dashboard</h2>
            <p className="text-sm text-gray-500">관리자 권한이 필요합니다</p>
          </div>

          {/* 에러 메시지 */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
              <AlertCircle className="size-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* 로그인 폼 */}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            {/* 이메일 입력 */}
            <div>
              <label htmlFor="admin-email" className="block text-sm text-gray-700 mb-2">
                관리자 이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dogsnack.com"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div>
              <label htmlFor="admin-password" className="block text-sm text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
                <input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
              </div>
            </div>

            {/* 로그인 버튼 */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? '로그인 중...' : '관리자 로그인'}
            </button>
          </form>

          {/* 안내 정보 */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800 text-center">
              ⚠️ 이 페이지는 관리자 전용입니다.<br />
              테스트 계정: admin@dogsnack.com / admin123
            </p>
          </div>
        </div>

        {/* 보안 안내 */}
        <div className="mt-6 text-center">
          <p className="text-xs text-blue-200">
            🔒 모든 통신은 암호화되어 안전하게 보호됩니다
          </p>
        </div>
      </div>
    </div>
  );
}