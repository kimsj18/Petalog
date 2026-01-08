package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.AdminDashboardDTO;
import com.example.demo.domain.admin.repository.ProductsRepository;
import com.example.demo.domain.oAuth.repository.OAuthRepository;
import com.example.demo.domain.user.orders.repository.OrdersRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AdminDashboardServiceImpl implements AdminDashboardService{

    private final ProductsRepository productsRepository;
    private final OrdersRepository ordersRepository;
    private final OAuthRepository oAuthRepository;

    @Override
    public AdminDashboardDTO getDashboard() {
        long totalProducts = productsRepository.count();
        long totalOrders = ordersRepository.count();
        long totalUsers = oAuthRepository.count();

        long totalRevenue = ordersRepository.findAll().stream()
                .mapToLong(order -> order.getFinalAmount()).sum();

        AdminDashboardDTO adminDashboardDTO = new AdminDashboardDTO(
                totalProducts, totalOrders, totalUsers, totalRevenue
        );
        System.out.println(adminDashboardDTO);
        return adminDashboardDTO;
    }
}
