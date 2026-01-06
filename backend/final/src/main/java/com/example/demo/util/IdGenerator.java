package com.example.demo.util;

public class IdGenerator {
    private static final long EPOCH = 1704067200000L; // 2024-01-01 기준 (기준 시점)
    private static final long NODE_ID = 1L;

    private static final long NODE_ID_BITS = 10L;
    private static final long SEQUENCE_BITS = 12L;

    private static final long MAX_NODE_ID = ~(-1L << NODE_ID_BITS);
    private static final long MAX_SEQUENCE = ~(-1L << SEQUENCE_BITS);

    private static final long NODE_ID_SHIFT = SEQUENCE_BITS;
    private static final long TIMESTAMP_SHIFT = SEQUENCE_BITS + NODE_ID_BITS;

    private static long lastTimestamp = -1L;
    private static long sequence = 0L;

    private synchronized static String nextId() {
        long currentTimestamp = currentTime();

        if (currentTimestamp < lastTimestamp) {
            throw new RuntimeException("시계가 뒤로 감겼음. ID 생성 실패");
        }

        if (currentTimestamp == lastTimestamp) {
            sequence = (sequence + 1) & MAX_SEQUENCE;
            if (sequence == 0) {
                // 밀리초 바뀔 때까지 대기
                currentTimestamp = waitNextMillis(currentTimestamp);
            }
        } else {
            sequence = 0L;
        }

        lastTimestamp = currentTimestamp;
        long rawId = ((currentTimestamp - EPOCH) << TIMESTAMP_SHIFT)
                | (NODE_ID << NODE_ID_SHIFT)
                | sequence;
        return Long.toString(rawId).substring(0, 16);
    }

    private static long waitNextMillis(long currentTimestamp) {
        while (currentTimestamp <= lastTimestamp) {
            currentTimestamp = currentTime();
        }
        return currentTimestamp;
    }

    private static long currentTime() {
        return System.currentTimeMillis();
    }

    // 회원 ID 생성
    public static String userId() {
        return "USR-" + nextId();
    }

    // 리뷰 ID 생성
    public static String reviewId(){return "rev-" + nextId();}

    // 카트 ID 생성
    public static String cartId(){return "cart-" + nextId();}

    //카트아이템 ID 생성
    public static String cartItemId(){return "cartItem-" + nextId();}

    //주소 ID 생성
    public static String addressId(){return "address-" + nextId();}

    //결제 ID 생성
    public static String paymentId(){return "pay-" + nextId();}

    //주문 ID 생성
    public static String orderId(){return "ord-" + nextId();}

    //주문 항목 ID 생성
    public static String orderItemId(){return "ordItem-" + nextId();}

}
