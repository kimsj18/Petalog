package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "review")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Setter
public class Review {

    @Id
    @Column(name = "id", length = 25)
    private String id;

    @Column(name = "title", nullable = false, length = 30)
    private String title;

    @Column(name = "content", nullable = false, length = 100)
    private String content;

    @Column(name = "score", nullable = false)
    private int score;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "products_id", nullable = false)
    private Products products;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
