package com.kb.ai_challenge.chatAi.dto.response;


import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ChatResponseDto {
    private String response;

    public ChatResponseDto(String response) {
        this.response = response;
    }

    public ChatResponseDto() {
    }
}
