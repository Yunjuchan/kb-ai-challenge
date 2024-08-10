package com.kb.ai_challenge.news.repository;

import com.kb.ai_challenge.news.entity.NaverNewsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NaverNewsRepository extends JpaRepository<NaverNewsEntity, Long> {

}
