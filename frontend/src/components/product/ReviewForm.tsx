'use client';

import React, { useState, useEffect } from 'react';
import { Star, X } from 'lucide-react';
import { reviewService, CreateReviewRequest, UpdateReviewRequest } from '@/services/reviewService';

interface ReviewFormProps {
  productId: string;
  productName: string;
  reviewId?: string; // 수정 모드일 때 리뷰 ID
  initialData?: {
    title: string;
    content: string;
    score: number;
  };
  onClose: () => void;
  onSuccess: () => void;
}

export function ReviewForm({ productId, productName, reviewId, initialData, onClose, onSuccess }: ReviewFormProps) {
  const isEditMode = !!reviewId;
  const [score, setScore] = useState(initialData?.score || 0);
  const [hoveredScore, setHoveredScore] = useState(0);
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setScore(initialData.score);
      setTitle(initialData.title);
      setContent(initialData.content);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (score === 0) {
      setError('평점을 선택해주세요.');
      return;
    }
    
    if (!title.trim()) {
      setError('제목을 입력해주세요.');
      return;
    }
    
    if (!content.trim()) {
      setError('내용을 입력해주세요.');
      return;
    }

    if (content.trim().length < 7) {
      setError('내용은 최소 7자 이상 입력해주세요.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (isEditMode && reviewId) {
        // 수정 모드
        const updateData: UpdateReviewRequest = {
          title: title.trim(),
          content: content.trim(),
          score: score,
        };

        const response = await reviewService.updateReview(reviewId, updateData);
        
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          setError(response.error || '리뷰 수정에 실패했습니다.');
        }
      } else {
        // 작성 모드
        const reviewData: CreateReviewRequest = {
          products_id: productId,
          title: title.trim(),
          content: content.trim(),
          score: score,
        };

        const response = await reviewService.createReview(reviewData);
        
        if (response.success) {
          onSuccess();
          onClose();
        } else {
          setError(response.error || '리뷰 작성에 실패했습니다.');
        }
      }
    } catch {
      setError(isEditMode ? '리뷰 수정 중 오류가 발생했습니다.' : '리뷰 작성 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{isEditMode ? '리뷰 수정' : '리뷰 작성'}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="size-5 text-gray-500" />
            </button>
          </div>

          {/* 제품 정보 */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <p className="text-sm text-gray-500 mb-1">제품</p>
            <p className="text-gray-900">{productName}</p>
          </div>

          {/* 폼 */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 평점 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                평점 <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setScore(star)}
                    onMouseEnter={() => setHoveredScore(star)}
                    onMouseLeave={() => setHoveredScore(0)}
                    className="p-1"
                  >
                    <Star
                      className={`size-8 transition-colors ${
                        star <= (hoveredScore || score)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                {score > 0 && (
                  <span className="ml-2 text-sm text-gray-600">
                    {score}점
                  </span>
                )}
              </div>
            </div>

            {/* 제목 */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="리뷰 제목을 입력해주세요"
                maxLength={30}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                {title.length}/30자
              </p>
            </div>

            {/* 내용 */}
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => {
                  if (e.target.value.length <= 100) {
                    setContent(e.target.value);
                  }
                }}
                placeholder="제품에 대한 솔직한 리뷰를 작성해주세요."
                rows={6}
                maxLength={100}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                {content.length}/100자 (최소 7자 이상)
              </p>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                취소
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? (isEditMode ? '수정 중...' : '작성 중...') : (isEditMode ? '리뷰 수정' : '리뷰 등록')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

