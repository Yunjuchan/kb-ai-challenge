package com.kb.ai_challenge.util;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Component
public class ScheduledCrwaling {
    private final RestTemplate restTemplate = new RestTemplate();

    // 매 정각마다 (1시간 간격으로) 실행
    @Scheduled(cron = "0 0 * * * ?")
    public void performCrawling() {
        String url = "http://localhost:8000/api/run-method/";

        try {
            // POST 요청을 보내고 응답을 문자열로 받습니다.
            String response = restTemplate.postForObject(url, null, String.class);
            System.out.println("Crawling API 호출 완료: " + response);
        } catch (Exception e) {
            System.err.println("Crawling API 호출 중 오류 발생: " + e.getMessage());
        }
    }
}
