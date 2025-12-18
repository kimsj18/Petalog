'use client';

import React from 'react';
import { AdminProductForm } from '@/components/admin/AdminProductForm';

export default function AdminProductEditRoute({ params }: { params: { id: string } }) {
  return <AdminProductForm mode="edit" productId={params.id} />;
}