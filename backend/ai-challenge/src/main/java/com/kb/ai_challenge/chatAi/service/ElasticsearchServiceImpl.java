package com.kb.ai_challenge.chatAi.service;

import com.google.gson.JsonObject;
import com.kb.ai_challenge.util.GsonUtil;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ElasticsearchServiceImpl implements ElasticsearchService {

    @Override
    public String createElasticsearchRequest(String query, String fromDateTime, String toDateTime) {
        JsonObject rangeObject = new JsonObject();
        rangeObject.addProperty("gte", fromDateTime);
        rangeObject.addProperty("lte", toDateTime);

        JsonObject range = new JsonObject();
        range.add("date_time", rangeObject);

        JsonObject multiMatch = new JsonObject();
        multiMatch.addProperty("query", query);
        multiMatch.add("fields", GsonUtil.toJsonArray(List.of("headline", "content")));
        multiMatch.addProperty("fuzziness", "AUTO");

        JsonObject multiMatchQuery = new JsonObject();
        multiMatchQuery.add("multi_match", multiMatch);

        JsonObject rangeQuery = new JsonObject();
        rangeQuery.add("range", range);

        JsonObject boolObject = new JsonObject();
        boolObject.add("must", GsonUtil.toJsonArrayFromJsonObject(List.of(multiMatchQuery, rangeQuery)));

        JsonObject queryObject = new JsonObject();
        queryObject.add("bool", boolObject);

        JsonObject requestBody = new JsonObject();
        requestBody.add("query", queryObject);

        return requestBody.toString();
    }
}
