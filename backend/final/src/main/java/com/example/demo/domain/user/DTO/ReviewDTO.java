package com.example.demo.domain.user.DTO;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ReviewDTO {
    private String title;
    private String content;
    private int score;

}
