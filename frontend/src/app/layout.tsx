import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '멍간식 - 강아지 간식 비교 플랫폼',
  description: '강아지 간식 비교 및 구매 플랫폼 - 알러지 관리부터 성분 분석까지',
  keywords: ['강아지 간식', '반려견', '간식 비교', '알러지', '성분 분석'],
  authors: [{ name: '멍간식' }],
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
