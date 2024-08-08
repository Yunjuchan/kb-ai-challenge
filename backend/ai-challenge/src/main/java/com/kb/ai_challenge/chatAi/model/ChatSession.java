package com.kb.ai_challenge.chatAi.model;

import com.kb.ai_challenge.chatAi.dto.request.ChatRequestDto;

import java.util.ArrayList;
import java.util.List;

public class ChatSession {
    private List<ChatRequestDto.Message> messages;

    public ChatSession() {
        this.messages = new ArrayList<>();
    }

    public List<ChatRequestDto.Message> getMessages() {
        return messages;
    }

    public void addMessage(String role, String content) {
        this.messages.add(new ChatRequestDto.Message(role, content));
    }
}
