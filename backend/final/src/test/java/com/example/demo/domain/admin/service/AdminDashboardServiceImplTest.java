package com.example.demo.domain.admin.service;

import com.example.demo.domain.admin.dto.AdminDashboardDTO;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
class AdminDashboardServiceImplTest {

    @Autowired
    private AdminDashboardService adminDashboardService;

    @Test
    void getDashboard(){
        adminDashboardService.getDashboard();
    }

}