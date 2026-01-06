package com.example.demo.domain.user.payments.service;

import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.payments.DTO.PaymentRequestDTO;
import com.example.demo.domain.user.payments.DTO.PaymentResponseDTO;
import com.example.demo.domain.user.payments.DTO.PortOnePaymentConfirmDTO;
import com.example.demo.domain.user.payments.client.PortOnePaymentClient;
import com.example.demo.domain.user.payments.repository.OrderItemRepository;
import com.example.demo.domain.user.payments.repository.OrderRepository;
import com.example.demo.domain.user.payments.repository.PaymentRepository;
import com.example.demo.domain.user.repository.ProductsfindRepository;
import com.example.demo.domain.user.repository.cart.CartRepository;
import com.example.demo.domain.user.repository.cartItem.CartItemRepository;
import com.example.demo.entity.*;
import com.example.demo.util.IdGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductsfindRepository productsfindRepository;
    private final OAuthRepository oAuthRepository;
    private final PortOnePaymentClient portOnePaymentClient;

    @Override
    public PaymentResponseDTO createPaymentRequest(String userId, PaymentRequestDTO requestDTO) {
        log.info("결제 요청 생성: userId={}, type={}", userId, requestDTO.getType());

        User user = oAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // 주문번호 생성 (ORD + YYYYMMDD + 일련번호)
        String orderNumber = generateOrderNumber();
        
        // 결제 엔티티 생성 (결제 전 상태)
        payments payment = payments.builder()
                .paymentId(IdGenerator.paymentId())
                .merchantUid(orderNumber)  // 포트원 merchant_uid (주문번호)
                .amount(requestDTO.getAmount())
                .paymentMethod(requestDTO.getPaymentMethod())
                .paymentStatus("PENDING")
                .build();

        payment = paymentRepository.save(payment);

        log.info("결제 요청 생성 완료: paymentId={}, merchantUid={}", payment.getPaymentId(), payment.getMerchantUid());

        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .merchantUid(payment.getMerchantUid())
                .orderNumber(orderNumber)
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    public PaymentResponseDTO confirmPayment(String userId, PortOnePaymentConfirmDTO confirmDTO) {
        log.info("결제 승인 처리: userId={}, impUid={}, merchantUid={}", userId, confirmDTO.getImpUid(), confirmDTO.getMerchantUid());

        // 결제 정보 조회
        payments payment = paymentRepository.findByMerchantUid(confirmDTO.getMerchantUid())
                .orElseThrow(() -> new IllegalArgumentException("결제 정보를 찾을 수 없습니다."));

        // 금액 검증
        if (payment.getAmount() != confirmDTO.getAmount()) {
            throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
        }

        // 포트원 API 호출하여 결제 조회 및 검증
        PortOnePaymentClient.PortOnePaymentResponse portOneResponse = portOnePaymentClient.getPayment(confirmDTO.getImpUid());

        // 결제 상태 확인
        if (!"PAID".equals(portOneResponse.getStatus())) {
            throw new IllegalArgumentException("결제가 완료되지 않았습니다. 상태: " + portOneResponse.getStatus());
        }

        // 금액 재검증 (포트원에서 받은 금액과 비교)
        if (portOneResponse.getAmount() != confirmDTO.getAmount()) {
            throw new IllegalArgumentException("결제 금액이 일치하지 않습니다.");
        }

        // 결제 정보 업데이트
        payment.setImpUid(portOneResponse.getId());  // imp_uid 저장
        payment.setTransactionId(portOneResponse.getTransactionId());
        payment.setPaymentStatus("COMPLETED");

        // 주문 생성 (결제 완료 시점에)
        Orders order = createOrder(userId, payment, confirmDTO);
        payment.setOrders(order);

        payment = paymentRepository.save(payment);

        // 장바구니 비우기 (장바구니 결제인 경우)
        if (payment.getOrders() != null) {
            clearCartIfNeeded(userId, payment);
        }

        log.info("결제 승인 완료: paymentId={}, orderId={}", payment.getPaymentId(), order.getOrdersId());

        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .ordersId(order.getOrdersId())
                .orderNumber(order.getOrderNumber())
                .merchantUid(payment.getMerchantUid())
                .impUid(payment.getImpUid())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paidAt(LocalDateTime.now())
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Override
    public PaymentResponseDTO cancelPayment(String userId, String paymentId, String cancelReason, Integer cancelAmount) {
        log.info("결제 취소: userId={}, paymentId={}", userId, paymentId);

        payments payment = paymentRepository.findById(paymentId)
                .orElseThrow(() -> new IllegalArgumentException("결제 정보를 찾을 수 없습니다."));

        if (!"COMPLETED".equals(payment.getPaymentStatus())) {
            throw new IllegalArgumentException("취소할 수 없는 결제 상태입니다.");
        }

        // 포트원 API 호출하여 결제 취소
        PortOnePaymentClient.PortOnePaymentResponse portOneResponse = portOnePaymentClient.cancelPayment(
                payment.getImpUid(),  // imp_uid
                cancelReason,
                cancelAmount
        );

        // 결제 정보 업데이트
        payment.setPaymentStatus("CANCELLED");

        // 주문 상태 업데이트
        if (payment.getOrders() != null) {
            Orders order = payment.getOrders();
            order.setOrderStatus("CANCELLED");
            order.setUpdateAt(LocalDateTime.now());
            orderRepository.save(order);
        }

        payment = paymentRepository.save(payment);

        log.info("결제 취소 완료: paymentId={}", paymentId);

        return PaymentResponseDTO.builder()
                .paymentId(payment.getPaymentId())
                .ordersId(payment.getOrders() != null ? payment.getOrders().getOrdersId() : null)
                .orderNumber(payment.getOrders() != null ? payment.getOrders().getOrderNumber() : null)
                .merchantUid(payment.getMerchantUid())
                .impUid(payment.getImpUid())
                .transactionId(payment.getTransactionId())
                .amount(payment.getAmount())
                .paymentMethod(payment.getPaymentMethod())
                .paymentStatus(payment.getPaymentStatus())
                .paidAt(null)
                .createdAt(LocalDateTime.now())
                .build();
    }

    /**
     * 주문 생성 (결제 완료 시점에)
     */
    private Orders createOrder(String userId, payments payment, PortOnePaymentConfirmDTO confirmDTO) {
        User user = oAuthRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("사용자를 찾을 수 없습니다."));

        // TODO: PaymentRequestDTO에서 배송지 정보를 가져와야 함
        // 현재는 임시로 처리 (나중에 Payment 엔티티에 배송지 정보 추가 필요)
        
        Orders order = Orders.builder()
                .ordersId(IdGenerator.orderId())
                .user(user)
                .orderNumber(payment.getMerchantUid())
                .totalAmount(payment.getAmount() - 3000)  // 배송비 제외 (임시)
                .deliveryFee(3000)  // 임시
                .finalAmount(payment.getAmount())
                .orderStatus("PAID")
                .createdAt(LocalDateTime.now())
                .updateAt(LocalDateTime.now())
                .build();

        order = orderRepository.save(order);

        // TODO: 주문 항목 생성 (장바구니 또는 바로구매 정보에서)
        // 현재는 임시 처리

        return order;
    }

    /**
     * 장바구니 비우기
     */
    private void clearCartIfNeeded(String userId, payments payment) {
        try {
            Carts cart = cartRepository.findByUser_UserId(userId).orElse(null);
            if (cart != null) {
                List<CartItem> cartItems = cartItemRepository.findByCarts_CartId(cart.getCartId());
                cartItemRepository.deleteAll(cartItems);
                log.info("장바구니 비우기 완료: userId={}", userId);
            }
        } catch (Exception e) {
            log.warn("장바구니 비우기 실패: {}", e.getMessage());
        }
    }

    /**
     * 주문번호 생성 (ORD + YYYYMMDD + 일련번호)
     */
    private String generateOrderNumber() {
        String date = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        // 간단한 일련번호 생성 (실제로는 DB에서 오늘 날짜의 주문 수를 조회해서 +1)
        String sequence = String.format("%03d", System.currentTimeMillis() % 1000);
        return "ORD" + date + sequence;
    }
}

