package com.example.demo.domain.user.payments.service;

import com.example.demo.domain.user.payments.DTO.PaymentRequestDTO;
import com.example.demo.domain.user.payments.DTO.PaymentResponseDTO;
import com.example.demo.domain.user.payments.DTO.PortOnePaymentConfirmDTO;

public interface PaymentService {
    
    /**
     * 결제 요청 생성 (merchant_uid 생성)
     */
    PaymentResponseDTO createPaymentRequest(String userId, PaymentRequestDTO requestDTO);
    
    /**
     * 결제 승인 처리 (포트원 결제 조회 및 검증)
     */
    PaymentResponseDTO confirmPayment(String userId, PortOnePaymentConfirmDTO confirmDTO);
    
    /**
     * 결제 취소
     */
    PaymentResponseDTO cancelPayment(String userId, String paymentId, String cancelReason, Integer cancelAmount);
}

