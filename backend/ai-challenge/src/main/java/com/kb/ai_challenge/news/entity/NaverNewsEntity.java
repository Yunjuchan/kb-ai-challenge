package com.kb.ai_challenge.news.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "naver_news")
public class NaverNewsEntity {

    @Id
    @Column(name="news_id")
    private String newsId;

    @Column(name="headline")
    private String headline;

    @Column(name="content", columnDefinition = "TEXT")
    private String content;

    @Column(name="keyword")
    private String keyword;

    @Column(name="news_date")
    private LocalDateTime newsDate;

    @Column(name="news_press")
    private String newsPress;


}
