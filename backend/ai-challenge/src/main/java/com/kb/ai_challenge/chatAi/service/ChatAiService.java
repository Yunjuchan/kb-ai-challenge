package com.kb.ai_challenge.chatAi.service;

import com.kb.ai_challenge.chatAi.dto.request.ChatRequestDto;
import com.kb.ai_challenge.chatAi.dto.response.ChatResponseDto;

import java.io.IOException;
import java.util.List;

public interface ChatAiService {
    ChatResponseDto getResponse(List<ChatRequestDto.Message> newMessages) throws IOException;
//    ChatResponseDto getSummary();
    void resetSession();
}
