'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/common/Header';

export function HeaderWrapper() {
  const pathname = usePathname();
  
  // admin 페이지에서는 Header를 표시하지 않음
  if (pathname?.startsWith('/admin')) {
    return null;
  }
  
  return <Header />;
}

