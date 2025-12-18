'use client';

import React, { useState } from 'react';
import { Header } from '../components/common/Header';
import { Hero } from '../components/Hero';
import { TrendingRanking } from '../components/TrendingRanking';
import { AllergyComparison } from '../components/AllergyComparison';
import { SnackTypeComparison } from '../components/SnackTypeComparison';
import { ProductGrid } from '../components/product/ProductGrid';
import { ComparisonModal } from '../components/ComparisonModal';
import { FilterSidebar } from '../components/FilterSidebar';
import { Product, ProductFilters } from '../types';

export default function HomePage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showComparison, setShowComparison] = useState(false);
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [filters, setFilters] = useState<ProductFilters>({
    priceRange: [0, 100000],
    ageGroup: [],
    benefits: [],
    brands: [],
  });

  const handleSelectProduct = (product: Product) => {
    if (selectedProducts.find(p => p.products_id === product.products_id)) {
      setSelectedProducts(selectedProducts.filter(p => p.products_id !== product.products_id));
    } else if (selectedProducts.length < 3) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  const handleCompare = () => {
    if (selectedProducts.length >= 2) {
      setShowComparison(true);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/*<Hero />*/}
        <TrendingRanking />
        <AllergyComparison />
        <SnackTypeComparison />
        
        {/*<section className="max-w-6xl mx-auto px-4 py-16">*/}
        {/*  <div className="flex gap-8">*/}
        {/*    <FilterSidebar */}
        {/*      filters={filters}*/}
        {/*      onFiltersChange={setFilters}*/}
        {/*    />*/}
        {/*    <div className="flex-1">*/}
        {/*      <ProductGrid */}
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