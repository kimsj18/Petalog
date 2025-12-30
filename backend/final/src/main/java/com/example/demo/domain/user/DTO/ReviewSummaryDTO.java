package com.example.demo.domain.user.DTO;

import lombok.*;
import org.springframework.stereotype.Service;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewSummaryDTO {
    private int reviewCount;
    private double reviewAvg;
}
