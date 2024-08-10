package com.kb.ai_challenge.chatAi.service;


public interface ElasticsearchService {
    public String createElasticsearchRequest(String query, String fromDateTime, String toDateTime);
}
