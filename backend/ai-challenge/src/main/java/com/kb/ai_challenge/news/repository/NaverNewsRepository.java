package com.kb.ai_challenge.news.repository;

import com.kb.ai_challenge.news.entity.NaverNewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NaverNewsRepository extends JpaRepository<NaverNewsEntity, String> {
    // news_id로 뉴스 리스트를 조회
    List<NaverNewsEntity> findByNewsIdIn(List<String> newsIds);
}
