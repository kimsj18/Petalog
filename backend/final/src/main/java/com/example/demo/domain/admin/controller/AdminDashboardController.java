package com.example.demo.domain.admin.controller;

import com.example.demo.domain.admin.dto.AdminDashboardDTO;
import com.example.demo.domain.admin.service.AdminDashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/admin")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    @GetMapping("/dashboard")
    public AdminDashboardDTO getDashBoard(){
        return adminDashboardService.getDashboard();
    }

}
