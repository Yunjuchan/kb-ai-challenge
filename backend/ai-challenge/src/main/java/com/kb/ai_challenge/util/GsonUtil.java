package com.kb.ai_challenge.util;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.util.List;

public class GsonUtil {
    // List<String>을 받아서 JsonArray로 변환하는 메서드
    public static JsonArray toJsonArray(List<String> list) {
        JsonArray jsonArray = new JsonArray();
        for (String item : list) {
            jsonArray.add(item);
        }
        return jsonArray;
    }

    // List<JsonObject>을 받아서 JsonArray로 변환하는 메서드
    public static JsonArray toJsonArrayFromJsonObject(List<JsonObject> list) {
        JsonArray jsonArray = new JsonArray();
        for (JsonObject item : list) {
            jsonArray.add(item);
        }
        return jsonArray;
    }
}

