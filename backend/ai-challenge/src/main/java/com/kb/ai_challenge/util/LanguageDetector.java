package com.kb.ai_challenge.chatAi.util;

import java.util.regex.Pattern;

public class LanguageDetector {
    private static final Pattern ENGLISH_PATTERN = Pattern.compile("[a-zA-Z]");

    public static boolean isEnglish(String text) {
        if (text == null) {
            return false;
        }
        return ENGLISH_PATTERN.matcher(text).find();
    }
}
