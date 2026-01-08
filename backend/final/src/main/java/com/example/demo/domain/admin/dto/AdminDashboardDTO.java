package com.example.demo.domain.admin.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class AdminDashboardDTO {
    private long totalProducts;
    private long totalOrders;
    private long totalUsers;
    private long totalRevenue;
}
