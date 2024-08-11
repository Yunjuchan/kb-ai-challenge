package com.kb.ai_challenge.news.repository;

import com.kb.ai_challenge.news.entity.TodayIssue;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface TodayIssueRepository extends JpaRepository<TodayIssue, Long> {
    // 오늘 날짜 기준으로 issue_id가 높은 순으로 5개 추출
    @Query("SELECT ti FROM today_issue ti WHERE DATE(ti.date) = :today ORDER BY ti.id DESC")
    List<TodayIssue> findTop5ByDateOrderByIdDesc(@Param("today") Date today, Pageable pageable);

}
