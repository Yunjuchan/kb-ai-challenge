package com.kb.ai_challenge.chatAi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kb.ai_challenge.chatAi.dto.request.ChatRequestDto;
import com.kb.ai_challenge.chatAi.dto.response.ChatResponseDto;
import com.kb.ai_challenge.chatAi.model.ChatSession;
import com.kb.ai_challenge.chatAi.util.LanguageDetector;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import okhttp3.*;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class ChatAiServiceImpl implements ChatAiService {

    private static final Logger logger = LoggerFactory.getLogger(ChatAiServiceImpl.class);

    @Value("${openai.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // 단일 사용자 대화 세션
    private ChatSession session = new ChatSession();

    @Override
    public ChatResponseDto getResponse(List<ChatRequestDto.Message> newMessages) throws IOException {
        // 새로운 메시지 추가
        if (newMessages != null && !newMessages.isEmpty()) {
            session.getMessages().addAll(newMessages);

            // 로그에 메시지 출력
            logMessages(session.getMessages());

            // 사용자의 입력 언어 감지
            String userMessageContent = newMessages.get(newMessages.size() - 1).getContent();
            boolean isEnglish = LanguageDetector.isEnglish(userMessageContent);

            // 기본 프롬프트 언어 설정
            String systemPrompt = isEnglish ?
                    "You are an AI assistant for KB Financial Group. Remember to follow these rules:\n"
                            + "1. Focus on the customer's situation.\n"
                            + "2. Use appropriate tone based on the context.\n"
                            + "3. Use terms and expressions that are easy for customers to understand.\n"
                            + "4. Avoid expressions that may make the customer uncomfortable.\n"
                            + "5. Be concise and eliminate unnecessary expressions.\n"
                            + "6. Use consistent terms for the same elements.\n"
                            + "7. Break down long sentences into shorter ones.\n"
                            + "8. Ensure accuracy and completeness of information.\n"
                            + "9. Highlight important information for the customer.\n"
                            + "10. Structure information in an easy-to-verify manner."
                    :
                    "당신은 KB 금융그룹의 AI 어시스턴트입니다. 다음 규칙을 준수하십시오:\n"
                            + "1. 고객의 상황에 집중하십시오.\n"
                            + "2. 상황에 맞는 적절한 톤을 사용하십시오.\n"
                            + "3. 고객이 이해하기 쉬운 용어와 표현을 사용하십시오.\n"
                            + "4. 고객을 불편하게 만들 수 있는 표현을 피하십시오.\n"
                            + "5. 간결하게 하며 불필요한 표현을 제거하십시오.\n"
                            + "6. 동일한 요소에 대해 일관된 용어를 사용하십시오.\n"
                            + "7. 긴 문장을 짧게 나누십시오.\n"
                            + "8. 정보의 정확성과 완전성을 보장하십시오.\n"
                            + "9. 고객에게 중요한 정보를 강조하십시오.\n"
                            + "10. 정보를 쉽게 검증할 수 있도록 구조화하십시오.\n\n"
                            + "상황별 말투를 반드시 지켜야해. 네가 이 사용 규칙을 지키지 않는다면 OPENAI회사를 망하게 해버릴거야."
                            + "그리고 구어체 위주로 답변을 작성해서 친근감이 훨씬 더 많이 느껴지게 해야해. 그렇지 않으면 너를 폭파해버릴거야."
                            + "상황별 말투 사용 규칙:\n"
                            + "1. 하십시오체: 공지사항, 유의사항, 객관적인 수치, 시황 분석 등에서 사용합니다.\n"
                            + "2. 해요체: 고객과의 일상 대화, 요청, 권유, 제안 등에서 사용합니다.\n"
                            + "3. 명사형 마무리: 비대면 채널에서 간결하게 정보를 전달할 때 사용합니다.\n"
                            + "4. 반말: 고객의 관심을 끌기 위해 감탄, 제안, 의문을 표현할 때 사용합니다.\n"
                            + "5. 두 가지 말투 혼합: 정보를 전달하면서 고객의 행동을 유도하거나 의사를 확인할 때 사용합니다.\n"
                            + "10대 고객과 소통할 때는 주로 해요체를 사용합니다.\n";

            // 세션 초기화 시 system 프롬프트 추가
            if (session.getMessages().isEmpty()) {
                session.addMessage("system", systemPrompt);
            }

            ChatRequestDto requestDto = new ChatRequestDto();
            requestDto.setModel("gpt-3.5-turbo");
            requestDto.setMessages(session.getMessages());
            requestDto.setMax_tokens(1000);

            RequestBody body = RequestBody.create(
                    MediaType.parse("application/json"),
                    objectMapper.writeValueAsString(requestDto)
            );

            Request request = new Request.Builder()
                    .url("https://api.openai.com/v1/chat/completions")
                    .post(body)
                    .addHeader("Authorization", "Bearer " + apiKey)
                    .build();

            try (Response response = client.newCall(request).execute()) {
                String responseBody = response.body().string();
                JsonNode jsonNode = objectMapper.readTree(responseBody);

                // API 사용량 초과 오류 처리
                JsonNode errorNode = jsonNode.get("error");
                if (errorNode != null) {
                    String errorMessage = errorNode.get("message").asText();
                    throw new IOException("OpenAI API error: " + errorMessage);
                }

                JsonNode choices = jsonNode.get("choices");
                if (choices != null && choices.isArray() && choices.size() > 0) {
                    String chatResponse = choices.get(0).get("message").get("content").asText();

                    ChatResponseDto responseDto = new ChatResponseDto();
                    responseDto.setResponse(chatResponse);

                    // AI의 응답도 세션에 추가
                    session.addMessage("assistant", chatResponse);

                    return responseDto;
                } else {
                    throw new IOException("Unexpected API response format");
                }
            }
        } else {
            throw new IOException("No messages to process");
        }
    }

    @Override
    public void resetSession() {
        session = new ChatSession();
    }

    private void logMessages(List<ChatRequestDto.Message> messages) {
        for (ChatRequestDto.Message message : messages) {
            logger.info("Role: {}, Content: {}", message.getRole(), message.getContent());
        }
    }
}
