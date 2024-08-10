package com.kb.ai_challenge.news.repository;

import com.kb.ai_challenge.news.entity.TodayIssue;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodayIssueRepository extends JpaRepository<TodayIssue, Long> {

}
