"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";

export function Search() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || "");

  // URL 쿼리 파라미터 변경 시 검색어 동기화
  useEffect(() => {
    const query = searchParams.get('q') || "";
    setSearchQuery(query);
  }, [searchParams]);

  // 디바운싱된 검색 - 입력 시 자동으로 /search 페이지로 이동
  useEffect(() => {
    if (pathname !== '/search') return; // /search 페이지에서만 자동 검색

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push("/search");
      }
    }, 500); // 0.5초 디바운싱

    return () => clearTimeout(timeoutId);
  }, [searchQuery, pathname, router]);

  const handSearch = () => {
      router.push("/search");
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (searchQuery.trim()) {
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      } else {
        router.push("/search");
      }
    }
  };



  return (
    <div className="pb-4">
      <div className="relative" onClick={handSearch}>
        <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400"

        />
        <input
          type="text"
          placeholder="간식 이름, 브랜드를 검색하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    </div>
  );
}

