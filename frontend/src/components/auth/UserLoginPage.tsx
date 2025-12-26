'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Mail, Lock } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

export function UserLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, oauthLogin, isLoading } = useAuthStore();

  const handleBack = () => {
    router.back();
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login({
        username: email, // 백엔드는 username 필드 사용
        password: password,
      });

      const userRole = useAuthStore.getState().user?.userRole;
      if(userRole === "USER"){
        router.push("/")
      }else{
        router.push("/admin")
      }
    } catch (error: any) {
      alert(error.message || '로그인에 실패했습니다.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      // TODO: Google OAuth 실제 구현 필요
      // 임시로 mock 데이터 사용 (실제로는 OAuth 플로우를 구현해야 함)
      await oauthLogin({
        provider: 'google',
        oauth_id: 'google_123',
        email: 'user@gmail.com',
        name: 'Google User',
      });
      
      router.push('/');
    } catch (error: any) {
      alert(error.message || 'Google 로그인에 실패했습니다.');
    }
  };

  const handleKakaoLogin = async () => {
    try {
      // TODO: Kakao OAuth 실제 구현 필요
      await oauthLogin({
        provider: 'kakao',
        oauth_id: 'kakao_123',
        email: 'user@kakao.com',
        name: 'Kakao User',
      });
      
      router.push('/');
    } catch (error: any) {
      alert(error.message || 'Kakao 로그인에 실패했습니다.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* 로고 */}
        <div className="text-center mb-8">
          <h1 className="text-blue-600 text-3xl mb-2">🐾 멍간식</h1>
          <p className="text-gray-600">강아지 간식 비교 플랫폼</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl text-gray-900 mb-6 text-center">로그인</h2>

          {/* 이전 페이지로 돌아가기 버튼 */}
          <button
            type="button"
            onClick={handleBack}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="size-5" />
          </button>

          {/* 구글 로그인 버튼 */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-300 text-gray-700 py-4 rounded-lg hover:bg-gray-50 hover:border-blue-500 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
          >
            <svg className="size-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span className="text-base">Google로 계속하기</span>
          </button>

          {/* 카카오 로그인 버튼 */}
          <button
            type="button"
            onClick={handleKakaoLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 bg-yellow-500 text-white py-4 rounded-lg hover:bg-yellow-600 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm mt-3"
          >
            <span className="text-base">Kakao로 계속하기</span>
          </button>

          {/* 이메일 로그인 폼 */}
          <form onSubmit={handleLogin} className="mt-6">
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                이메일
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                비밀번호
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 bg-blue-500 text-white py-4 rounded-lg hover:bg-blue-600 transition-all disabled:bg-gray-100 disabled:cursor-not-allowed shadow-sm"
            >
              <Lock className="size-5" />
              <span className="text-base">{isLoading ? '로그인 중...' : '로그인'}</span>
            </button>
          </form>

          {/* 안내 메시지 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800 text-center">
              🐶 구글 계정으로 간편하게 시작하세요!
            </p>
          </div>
        </div>

        {/* 추가 안내 */}
        <div className="mt-6 text-center space-y-4">
          <p className="text-xs text-gray-500">
            로그인하면{' '}
            <a href="#" className="text-blue-600 hover:underline">
              서비스 약관
            </a>
            과{' '}
            <a href="#" className="text-blue-600 hover:underline">
              개인정보 보호정책
            </a>
            에 동의하게 됩니다.
          </p>

          {/* 관리자 로그인 링크 (숨김) */}
          <button
            onClick={() => router.push('/admin/login')}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            관리자
          </button>
        </div>
      </div>
    </div>
  );
}
