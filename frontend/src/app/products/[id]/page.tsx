'use client';

import React from 'react';
import { ProductDetailPage } from '../../../components/product/ProductDetailPage';

export default function ProductDetailRoute({ params }: { params: { id: string } }) {
  return <ProductDetailPage productId={params.id} />;
}