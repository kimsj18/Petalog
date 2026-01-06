package com.example.demo.domain.user.payments.client;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class PortOnePaymentClient {

    @Value("${portone.api-secret}")
    private String apiSecret;

    private static final String PORTONE_API_URL = "https://api.portone.io";

    private final RestTemplate restTemplate;

    public PortOnePaymentClient() {
        this.restTemplate = new RestTemplate();
    }

    /**
     * 포트원 결제 조회 (결제 승인 확인)
     */
    public PortOnePaymentResponse getPayment(String paymentId) {
        try {
            log.info("포트원 결제 조회: paymentId={}", paymentId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "PortOne " + apiSecret);

            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<PortOnePaymentResponse> response = restTemplate.exchange(
                    PORTONE_API_URL + "/payments/" + paymentId,
                    HttpMethod.GET,
                    request,
                    PortOnePaymentResponse.class
            );

            log.info("포트원 결제 조회 성공: paymentId={}", paymentId);
            return response.getBody();

        } catch (Exception e) {
            log.error("포트원 결제 조회 실패: {}", e.getMessage(), e);
            throw new RuntimeException("결제 조회 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 포트원 결제 취소
     */
    public PortOnePaymentResponse cancelPayment(String paymentId, String cancelReason, Integer cancelAmount) {
        try {
            log.info("포트원 결제 취소 요청: paymentId={}", paymentId);

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("reason", cancelReason);
            if (cancelAmount != null) {
                requestBody.put("cancelAmount", cancelAmount);
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "PortOne " + apiSecret);

            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

            ResponseEntity<PortOnePaymentResponse> response = restTemplate.postForEntity(
                    PORTONE_API_URL + "/payments/" + paymentId + "/cancel",
                    request,
                    PortOnePaymentResponse.class
            );

            log.info("포트원 결제 취소 성공: paymentId={}", paymentId);
            return response.getBody();

        } catch (Exception e) {
            log.error("포트원 결제 취소 실패: {}", e.getMessage(), e);
            throw new RuntimeException("결제 취소 실패: " + e.getMessage(), e);
        }
    }

    /**
     * 포트원 응답 DTO
     */
    public static class PortOnePaymentResponse {
        private String id;  // paymentId (imp_uid)
        private String status;  // "PAID", "CANCELLED" 등
        private Long amount;  // 결제 금액
        private String currency;  // 통화
        private String orderId;  // merchant_uid
        private String transactionId;  // 거래 ID
        private String paidAt;  // 결제 완료 시간
        private String cancelledAt;  // 취소 시간

        // Getters and Setters
        public String getId() { return id; }
        public void setId(String id) { this.id = id; }
        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
        public Long getAmount() { return amount; }
        public void setAmount(Long amount) { this.amount = amount; }
        public String getCurrency() { return currency; }
        public void setCurrency(String currency) { this.currency = currency; }
        public String getOrderId() { return orderId; }
        public void setOrderId(String orderId) { this.orderId = orderId; }
        public String getTransactionId() { return transactionId; }
        public void setTransactionId(String transactionId) { this.transactionId = transactionId; }
        public String getPaidAt() { return paidAt; }
        public void setPaidAt(String paidAt) { this.paidAt = paidAt; }
        public String getCancelledAt() { return cancelledAt; }
        public void setCancelledAt(String cancelledAt) { this.cancelledAt = cancelledAt; }
    }
}

