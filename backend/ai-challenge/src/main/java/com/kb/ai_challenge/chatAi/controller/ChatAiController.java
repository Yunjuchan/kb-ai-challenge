package com.kb.ai_challenge.chatAi.controller;

import com.kb.ai_challenge.chatAi.dto.request.ChatPromptDto;
import com.kb.ai_challenge.chatAi.dto.request.ChatRequestDto;
import com.kb.ai_challenge.chatAi.dto.response.ChatResponseDto;
import com.kb.ai_challenge.chatAi.service.ChatAiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/chat")
public class ChatAiController {
    private final ChatAiService chatAiService;

    @Autowired
    public ChatAiController(ChatAiService chatAiService) {
        this.chatAiService = chatAiService;
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping(consumes = "application/json", produces = "application/json")
    public ResponseEntity<ChatResponseDto> askChatAi(@RequestBody ChatPromptDto chatPromptDto) {
        try {
            // 사용자 메시지 추가
            List<ChatRequestDto.Message> messages = new ArrayList<>();
            messages.add(new ChatRequestDto.Message("user", chatPromptDto.getPrompt()));

            ChatResponseDto response = chatAiService.getResponse(messages);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(new ChatResponseDto("gpt", "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/new-session")
    public ResponseEntity<ChatResponseDto> newChatSession() {
        chatAiService.resetSession(false);
        try {
            ChatResponseDto response = chatAiService.initializeSession();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (IOException e) {
            return new ResponseEntity<>(new ChatResponseDto("gpt", "Error: " + e.getMessage()), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}