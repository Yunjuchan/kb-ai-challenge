package com.kb.ai_challenge.news.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class TodayIssue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name="issue_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "news_id", referencedColumnName = "news_id", foreignKey = @ForeignKey(name = "fk_today_issue_news_id"))
    private NaverNewsEntity naverNewsEntity;

    @Column(name="date")
    private Date date;
}
