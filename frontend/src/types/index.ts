// DB 스키마에 맞춘 TypeScript 타입 정의

// ========================================
// Products (상품)
// ========================================
export interface Product {
  products_id: string;
  name: string;
  brand: string;
  category: string; // 간식, 사료, 영양제 등
  snack_type: string; // 트릿, 육포, 껌 등
  imageUrl: string;
  quantity: number;
  price?: number; // DB에는 없지만 프론트엔드에서 필요
  rating?: number;
  reviewCount?: number;
  // 관계 데이터 (JOIN 결과)
  ingredients?: Ingredient[];
  benefits?: ProductBenefit[];
  size?: string;
  madeIn?: string;
  ageGroup?: string[];
}

// ========================================
// Ingredients (원재료)
// ========================================
export interface Ingredient {
  ingredients_id: string;
  products_id: string;
  ingredients_name: string; // 닭, 소, 돼지 등
}

// ========================================
// Product Benefits (제품 효능)
// ========================================
export interface ProductBenefit {
  benefit_id: string;
  products_id: string;
  benefit_name: string;
}

// ========================================
// User (사용자)
// ========================================
export interface User {
  user_id: string;
  user_email: string;
  user_name: string;
  user_phone: string;
  user_oauth_provider?: string; // google, kakao 등
  user_oauth_id?: string;
  user_enter_day: string; // DATE
  user_status: number; // 1: 활성, 0: 탈퇴
  user_exit_day?: string; // DATE
  user_password?: string;
  userRole?:string
}

// ========================================
// User Address (배송지)
// ========================================
export interface UserAddress {
  address_id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  is_default: boolean;
  created_at: string; // DATETIME
}

// ========================================
// Carts (장바구니)
// ========================================
export interface Cart {
  cart_id: string;
  quantity: number;
  products_id: string;
  user_id: string;
  // JOIN 결과
  product?: Product;
}

// 프론트엔드 표시용 (기존 CartItem과 호환)
export interface CartItem {
  id: string; // cart_id
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
  products_id: string;
}

// ========================================
// Orders (주문)
// ========================================
export interface Order {
  orders_id: string;
  user_id: string;
  recipient_name: string;
  recipient_phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  created_at: string; // DATETIME
  // JOIN 결과
  orderItems?: OrderItem[];
  totalAmount?: number;
}

// ========================================
// Order Item (주문 상품)
// ========================================
export interface OrderItem {
  order_item_id: string;
  quantity: number;
  price: number;
  products_id: string;
  orders_id: string;
  // JOIN 결과
  product?: Product;
}

// ========================================
// Review (리뷰)
// ========================================
export interface Review {
  id: string;
  title: string;
  content: string;
  score: number; // 평점
  products_id: string;
  user_id: string;
  // JOIN 결과
  user?: User;
  created_at?: string;
}

// ========================================
// Pets (반려동물)
// ========================================
export interface Pet {
  pets_id: string;
  pets_name: string;
  pets_birth?: string; // DATE
  pets_weight?: number;
  user_id: string;
  pets_snack_type?: string;
  pets_ingredients?: string;
}

// ========================================
// JWT Refresh Token
// ========================================
export interface JwtRefreshToken {
  jwt_id: number;
  refresh_token: string;
  created_at: string; // DATETIME
}

// ========================================
// API 요청/응답 타입
// ========================================

// 로그인 요청
export interface LoginRequest {
  user_email: string;
  user_password: string;
}

// 로그인 응답
export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

// 회원가입 요청
export interface RegisterRequest {
  user_email: string;
  user_name: string;
  user_phone: string;
  user_password?: string;
  user_oauth_provider?: string;
  user_oauth_id?: string;
}

// 장바구니 추가 요청
export interface AddToCartRequest {
  products_id: string;
  quantity: number;
}

// 주문 생성 요청
export interface CreateOrderRequest {
  recipient_name: string;
  recipient_phone: string;
  zipcode: string;
  address1: string;
  address2?: string;
  items: {
    products_id: string;
    quantity: number;
    price: number;
  }[];
}

// 리뷰 작성 요청
export interface CreateReviewRequest {
  products_id: string;
  title: string;
  content: string;
  score: number;
}

// ========================================
// Filters (필터링)
// ========================================
export interface ProductFilters {
  priceRange: [number, number];
  ageGroup: string[];
  benefits: string[];
  brands: string[];
  category?: string;
  snack_type?: string;
  ingredients?: string[]; // 알러지 필터링
}
