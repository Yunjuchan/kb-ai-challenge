package com.kb.ai_challenge.news.repository;

import com.kb.ai_challenge.news.entity.NewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NewsRepository extends JpaRepository<NewsEntity, Long> {
    List<NewsEntity> findAllByCategory(String category);
    boolean existsByHeadline(String headline);
}
