package com.kb.ai_challenge.chatAi.dto.response;

public class ChatResponseDto {
    private String sender;
    private String text;

    public ChatResponseDto() {
    }

    public ChatResponseDto(String sender, String text) {
        this.sender = sender;
        this.text = text;
    }

    public String getSender() {
        return sender;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
