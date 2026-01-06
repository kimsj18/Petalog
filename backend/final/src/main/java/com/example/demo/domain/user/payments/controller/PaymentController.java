package com.example.demo.domain.user.payments.controller;

import com.example.demo.domain.oAuth.dto.UserDTO;
import com.example.demo.domain.user.payments.DTO.PaymentRequestDTO;
import com.example.demo.domain.user.payments.DTO.PaymentResponseDTO;
import com.example.demo.domain.user.payments.DTO.PortOnePaymentConfirmDTO;
import com.example.demo.domain.user.payments.service.PaymentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/payments")
public class PaymentController {

    private final PaymentService paymentService;

    /**
     * 결제 요청 생성 (merchant_uid 생성)
     * POST /api/v1/payments/request
     */
    @PostMapping("/request")
    public ResponseEntity<PaymentResponseDTO> createPaymentRequest(
            @AuthenticationPrincipal UserDTO userDTO,
            @RequestBody PaymentRequestDTO requestDTO
    ) {
        log.info("결제 요청 생성: userId={}", userDTO.getUserId());
        
        PaymentResponseDTO response = paymentService.createPaymentRequest(
                userDTO.getUserId(),
                requestDTO
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * 결제 승인 처리 (포트원 결제 조회 및 검증)
     * POST /api/v1/payments/confirm
     */
    @PostMapping("/confirm")
    public ResponseEntity<PaymentResponseDTO> confirmPayment(
            @AuthenticationPrincipal UserDTO userDTO,
            @RequestBody PortOnePaymentConfirmDTO confirmDTO
    ) {
        log.info("결제 승인 요청: userId={}, impUid={}, merchantUid={}", userDTO.getUserId(), confirmDTO.getImpUid(), confirmDTO.getMerchantUid());
        
        PaymentResponseDTO response = paymentService.confirmPayment(
                userDTO.getUserId(),
                confirmDTO
        );
        
        return ResponseEntity.ok(response);
    }

    /**
     * 결제 취소
     * POST /api/v1/payments/{paymentId}/cancel
     */
    @PostMapping("/{paymentId}/cancel")
    public ResponseEntity<PaymentResponseDTO> cancelPayment(
            @AuthenticationPrincipal UserDTO userDTO,
            @PathVariable String paymentId,
            @RequestParam(required = false) String cancelReason,
            @RequestParam(required = false) Integer cancelAmount
    ) {
        log.info("결제 취소 요청: userId={}, paymentId={}", userDTO.getUserId(), paymentId);
        
        PaymentResponseDTO response = paymentService.cancelPayment(
                userDTO.getUserId(),
                paymentId,
                cancelReason != null ? cancelReason : "사용자 요청",
                cancelAmount
        );
        
        return ResponseEntity.ok(response);
    }
}

