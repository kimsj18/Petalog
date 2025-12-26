'use client';

import React, {useEffect, useState} from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Search, Edit, Trash2, Plus } from 'lucide-react';
import {apiClient} from "@/lib/api";

interface IngredientDTO{
  name: string;
  percentage: number;
}

interface BenefitDTO{
  name: string;
}

interface ProductDetailDTO{
  productsId: string;
  name: string;
  brand: string;
  category: string;
  snackType: string;
  imageUrl: string;
  madeIn: string;
  size: number;
  price: number;
  quantity: number;
  description: string;
  ingredientDTOs: IngredientDTO[];
  benefitDTOs: BenefitDTO[];
}

export function AdminProductList() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<ProductDetailDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출로 상품 목록 가져오기
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiClient.get<ProductDetailDTO[]>('/v1/admin/products');

        if(response.success && response.data){
          setProducts(response.data);
          console.log(response.data);
        } else {
          setError(response.error || '상품 목록을 불러오는데 실패했습니다.');
        }
      } catch (err) {
        setError('네트워크 오류가 발생했습니다.');
        console.error('Failed to fetch products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // const [products, setProducts] = useState<Product[]>([
  //   {
  //     id: 'PROD001',
  //     name: '프리미엄 닭가슴살 큐브',
  //     brand: '네츄럴코어',
  //     category: 'treat',
  //     price: 15000,
  //     stockQuantity: 50,
  //     isActive: true,
  //     createdAt: '2024-01-15',
  //   },
  //   {
  //     id: 'PROD002',
  //     name: '오리지널 육포',
  //     brand: '펫밀리',
  //     category: 'jerky',
  //     price: 12000,
  //     stockQuantity: 30,
  //     isActive: true,
  //     createdAt: '2024-01-14',
  //   },
  //   {
  //     id: 'PROD003',
  //     name: '덴탈 껌',
  //     brand: '그리니스',
  //     category: 'dental',
  //     price: 8000,
  //     stockQuantity: 0,
  //     isActive: false,
  //     createdAt: '2024-01-13',
  //   },
  // ]);

  const handleBack = () => {
    router.back();
  };

  const handleAddProduct = () => {
    router.push('/admin/products/new');
  };

  const handleEditProduct = (productsId: string) => {
    router.push(`/admin/products/${productsId}/edit`);
  };

  const handleDeleteProduct = async (productsId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      // TODO: API 호출
      // await apiClient.delete(`/v1/admin/products/${productsId}`);
      setProducts(products.filter(p => p.productsId !== productsId));
      alert('삭제되었습니다.');
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={handleBack} className="text-gray-700 hover:text-gray-900">
                <ArrowLeft className="size-6" />
              </button>
              <h1 className="text-2xl text-gray-900">상품 관리</h1>
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus className="size-5" />
              새 상품 등록
            </button>
          </div>

          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              type="text"
              placeholder="상품명 또는 브랜드 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* 상품 테이블 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  상품명
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  브랜드
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  카테고리
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  가격
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  크기
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  재고
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  제조국
                </th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                  작업
                </th>
              </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                  <tr key={product.productsId} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.brand}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.category}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.price.toLocaleString()}원
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {product.size}g
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{product.quantity}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{product.madeIn}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                      <button
                          onClick={() => handleEditProduct(product.productsId)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit className="size-5 inline"/>
                      </button>
                      <button
                          onClick={() => handleDeleteProduct(product.productsId)}
                          className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="size-5 inline"/>
                      </button>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
              <div className="text-center py-12">
              <p className="text-gray-500">검색 결과가 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
