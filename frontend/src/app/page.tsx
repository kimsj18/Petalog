'use client';

import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';
import { Search } from '../components/common/Search';
import { TrendingRanking } from '../components/TrendingRanking';
import { AllergyComparison } from '../components/AllergyComparison';
import { ComparisonModal } from '../components/ComparisonModal';
import { Product } from '../types';

function SearchWrapper() {
  return (
    <Suspense fallback={<div className="pb-4"><div className="w-full h-10 bg-gray-100 rounded-lg animate-pulse" /></div>}>
      <Search />
    </Suspense>
  );
}

export default function HomePage() {
  const router = useRouter();
  const [selectedProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      setShowComparison(true);
    }
  };

  const handleProductClick = (product: Product) => {
    router.push(`/products/${product.products_id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-4 pt-4">
        <SearchWrapper />
      </div>
      <main>
        {/*<Hero />*/}
        <TrendingRanking onProductClick={handleProductClick} />
        <AllergyComparison onProductClick={handleProductClick} />
        {/*<SnackTypeComparison onProductClick={handleProductClick} />*/}
        
        {/*<section className="max-w-6xl mx-auto px-4 py-16">*/}
        {/*  <div className="flex gap-8">*/}
        {/*    <FilterSidebar*/}
        {/*      filters={filters}*/}
        {/*      onFiltersChange={setFilters}*/}
        {/*    />*/}
        {/*    <div className="flex-1">*/}
        {/*      <ProductGrid*/}
        {/*        onSelectProduct={handleSelectProduct}*/}
        {/*        selectedProducts={selectedProducts}*/}
        {/*        showAll={showAllProducts}*/}
        {/*        onToggleShowAll={() => setShowAllProducts(!showAllProducts)}*/}
        {/*        filters={filters}*/}
        {/*      />*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*</section>*/}

        {selectedProducts.length >= 2 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
            <button
              onClick={handleCompare}
              className="bg-blue-600 text-white px-8 py-4 rounded-full shadow-lg hover:bg-blue-700"
            >
              {selectedProducts.length}개 제품 비교하기
            </button>
          </div>
        )}

        <ComparisonModal
          products={selectedProducts}
          isOpen={showComparison}
          onClose={() => setShowComparison(false)}
        />
      </main>
    </div>
  );
}