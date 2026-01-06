-- 포트원으로 변경: payments 테이블 컬럼명 변경

-- 1. 컬럼명 변경
ALTER TABLE payments 
CHANGE COLUMN `toss_order_id` `merchant_uid` VARCHAR(100) NOT NULL COMMENT '포트원 주문번호 (merchant_uid)',
CHANGE COLUMN `payment_key` `imp_uid` VARCHAR(200) COMMENT '포트원 결제 고유번호 (imp_uid)';

-- 2. 인덱스 변경 (기존 인덱스가 있다면)
DROP INDEX IF EXISTS idx_toss_order_id ON payments;
DROP INDEX IF EXISTS idx_payment_key ON payments;

CREATE INDEX idx_merchant_uid ON payments(merchant_uid);
CREATE INDEX idx_imp_uid ON payments(imp_uid);

