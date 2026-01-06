package com.example.demo.domain.user.DTO;

import lombok.*;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ReviewDTO {
    private String id;
    private String title;
    private String content;
    private int score;
    private String userName;
    private String userId;
    private LocalDate createdAt;


}
