package com.kb.ai_challenge.chatAi.model;

import static com.kb.ai_challenge.util.ChatConstants.SYSTEM_PROMPT_KR;

public class ChatSessionManager {



    public static ChatSession createNewSession(String initialGreeting, String issueSummary) {
        ChatSession session = new ChatSession();
        session.addMessage("system", SYSTEM_PROMPT_KR);
        session.addMessage("assistant", initialGreeting);
        session.addMessage("assistant", issueSummary);
        return session;
    }
}