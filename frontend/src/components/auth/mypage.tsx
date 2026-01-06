'use client';

import React, { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface AddressFormData {
  recipient_name: string;
  recipient_phone: string;
  zipcode: string;
  address1: string;
  address2: string;
}

interface AddressData {
  addressId?: string;
  name: string;
  phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
}

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: {
          zonecode: string;
          address: string;
          addressEnglish: string;
          addressType: string;
          bname: string;
          buildingName: string;
        }) => void;
        width?: string;
        height?: string;
      }) => {
        open: () => void;
      };
    };
  }
}

export function MyPage() {
  const [formData, setFormData] = useState<AddressFormData>({
    recipient_name: '',
    recipient_phone: '',
    zipcode: '',
    address1: '',
    address2: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [hasExistingAddress, setHasExistingAddress] = useState(false);

  // 다음 우편번호 API 스크립트 로드
  React.useEffect(() => {
    const script = document.createElement('script');
    script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  // 주소 조회
  useEffect(() => {
    const loadAddress = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get<AddressData>('/v1/user/address');
        
        if (response.success && response.data) {
          // 기존 주소가 있으면 폼에 채우기
          setFormData({
            recipient_name: response.data.name || '',
            recipient_phone: response.data.phone || '',
            zipcode: response.data.zipcode || '',
            address1: response.data.address1 || '',
            address2: response.data.address2 || '',
          });
          setHasExistingAddress(true);
        }
      } catch (error: unknown) {
        // 주소가 없으면 그냥 넘어감 (404 등)
        console.log('주소를 찾을 수 없습니다:', error);
        setHasExistingAddress(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddress();
  }, []);

  // 우편번호 검색
  const handleSearchAddress = () => {
    if (!window.daum) {
      alert('주소 검색 서비스를 불러오는 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }

    new window.daum.Postcode({
      oncomplete: (data) => {
        setFormData((prev) => ({
          ...prev,
          zipcode: data.zonecode,
          address1: data.address,
        }));
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  // 폼 입력 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 폼 제출
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    // 유효성 검사
    if (!formData.recipient_name.trim()) {
      setMessage({ type: 'error', text: '받는사람 이름을 입력해주세요.' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.recipient_phone.trim()) {
      setMessage({ type: 'error', text: '받는사람 전화번호를 입력해주세요.' });
      setIsSubmitting(false);
      return;
    }

    if (!formData.zipcode.trim() || !formData.address1.trim()) {
      setMessage({ type: 'error', text: '주소를 검색해주세요.' });
      setIsSubmitting(false);
      return;
    }

    try {
      // 백엔드 API에 맞춰서 데이터 변환
      const requestData = {
        name: formData.recipient_name,
        phone: formData.recipient_phone,
        zipcode: formData.zipcode,
        address1: formData.address1,
        address2: formData.address2 || '',
      };

      // PUT으로 등록/수정 모두 처리
      const response = await apiClient.put('/v1/user/address', requestData);

      if (response.success) {
        setMessage({ 
          type: 'success', 
          text: hasExistingAddress 
            ? '주소가 성공적으로 수정되었습니다.' 
            : '주소가 성공적으로 등록되었습니다.' 
        });
        setHasExistingAddress(true);
      } else {
        setMessage({ 
          type: 'error', 
          text: response.error || (hasExistingAddress ? '주소 수정에 실패했습니다.' : '주소 등록에 실패했습니다.') 
        });
      }
    } catch (error: unknown) {
      setMessage({ 
        type: 'error', 
        text: error instanceof Error ? error.message : '주소 처리 중 오류가 발생했습니다.' 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center">로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">마이페이지</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {hasExistingAddress ? '배송지 수정' : '배송지 등록'}
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded-lg ${
              message.type === 'success'
                ? 'bg-green-50 text-green-800'
                : 'bg-red-50 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 받는사람 이름 */}
          <div>
            <label htmlFor="recipient_name" className="block text-sm font-medium text-gray-700 mb-1">
              받는사람 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="recipient_name"
              name="recipient_name"
              value={formData.recipient_name}
              onChange={handleChange}
              placeholder="받는사람 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* 받는사람 전화번호 */}
          <div>
            <label htmlFor="recipient_phone" className="block text-sm font-medium text-gray-700 mb-1">
              받는사람 전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="recipient_phone"
              name="recipient_phone"
              value={formData.recipient_phone}
              onChange={handleChange}
              placeholder="010-1234-5678"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* 우편번호 */}
          <div>
            <label htmlFor="zipcode" className="block text-sm font-medium text-gray-700 mb-1">
              우편번호 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="zipcode"
                name="zipcode"
                value={formData.zipcode}
                onChange={handleChange}
                placeholder="우편번호"
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="button"
                onClick={handleSearchAddress}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                우편번호 찾기
              </button>
            </div>
          </div>

          {/* 주소 */}
          <div>
            <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="address1"
              name="address1"
              value={formData.address1}
              onChange={handleChange}
              placeholder="주소를 검색해주세요"
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>

          {/* 상세주소 */}
          <div>
            <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">
              상세주소
            </label>
            <input
              type="text"
              id="address2"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              placeholder="상세주소를 입력하세요 (예: 101동 101호)"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* 제출 버튼 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting 
                ? (hasExistingAddress ? '수정 중...' : '등록 중...') 
                : (hasExistingAddress ? '주소 수정' : '주소 등록')
              }
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
