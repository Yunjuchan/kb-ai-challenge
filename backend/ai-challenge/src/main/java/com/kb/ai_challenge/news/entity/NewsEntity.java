package com.kb.ai_challenge.news.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "news", schema = "news")
public class NewsEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="news_id")
    private Long id;

    @Column(name="headline")
    private String headline;

//    @Lob
    @Column(name="content", columnDefinition = "TEXT")
    private String content;

    @Column(name="date_time")
    private LocalDateTime dateTime;

    @Column(name="category")
    private String category;
}
