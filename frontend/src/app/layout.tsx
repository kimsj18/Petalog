import type {Metadata, Viewport} from 'next';
import './globals.css';
import { AuthProvider } from './AuthProvider';
import { HeaderWrapper } from './HeaderWrapper';
import { GoogleOAuthProvider } from '@react-oauth/google';
import * as process from "process";

export const metadata: Metadata = {
  title: '멍간식 - 강아지 간식 비교 플랫폼',
  description: '강아지 간식 비교 및 구매 플랫폼 - 알러지 관리부터 성분 분석까지',
  keywords: ['강아지 간식', '반려견', '간식 비교', '알러지', '성분 분석'],
  authors: [{ name: '멍간식' }],
};

export const viewport :Viewport = {
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

  return (
    <html lang="ko">
      <body>
        <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <HeaderWrapper />
          {children}
        </AuthProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
