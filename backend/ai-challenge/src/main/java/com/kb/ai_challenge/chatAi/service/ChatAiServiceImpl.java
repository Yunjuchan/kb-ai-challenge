package com.kb.ai_challenge.chatAi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.kb.ai_challenge.chatAi.dto.request.ChatRequestDto;
import com.kb.ai_challenge.chatAi.dto.response.ChatResponseDto;
import com.kb.ai_challenge.chatAi.model.ChatSession;
import com.kb.ai_challenge.chatAi.model.ChatSessionManager;
import com.kb.ai_challenge.news.entity.NaverNewsEntity;
import com.kb.ai_challenge.news.entity.TodayIssue;
import com.kb.ai_challenge.news.repository.NaverNewsRepository;
import com.kb.ai_challenge.news.repository.TodayIssueRepository;
import com.kb.ai_challenge.util.ChatConstants;
import okhttp3.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatAiServiceImpl implements ChatAiService {

    private static final Logger logger = LoggerFactory.getLogger(ChatAiServiceImpl.class);

    @Value("${openai.api.key}")
    private String apiKey;

    private final OkHttpClient client = new OkHttpClient();
    private final ObjectMapper objectMapper = new ObjectMapper();

    // ElasticsearchService 주입
    @Autowired
    private ElasticsearchService elasticsearchService;

    @Autowired
    private TodayIssueRepository todayIssueRepository;

    @Autowired
    private NaverNewsRepository naverNewsRepository;

    // 사용자 대화 세션
    private ChatSession session = new ChatSession();

    @Override
    public ChatResponseDto getResponse(List<ChatRequestDto.Message> newMessages) throws IOException {
        if (newMessages == null || newMessages.isEmpty()) {
            throw new IOException("No messages to process");
        }

        // 새로운 메시지 추가
        session.getMessages().addAll(newMessages);
        logMessages(session.getMessages());

        // RAG로 기사 검색
        String userQuery = newMessages.get(0).getContent();
        String elasticsearchResponse = searchElasticsearchForArticles(userQuery);

        // ChatGPT API에 보내기 위한 요청 내용 준비
        String augmentedPrompt = "너가 가지고 있는 지식과 다음 기사 내용을 바탕으로 사용자의 질문에 답변해줘:\n\n"
                + elasticsearchResponse + "\n\n사용자 질문: " + userQuery
                + "답변을 중학생도 이해할 수 있도록 쉽게 설명해줘.\n\n"
                + "만약 기사 기반을 통해 응답을 할 경우 중요 키워드 3개도 함께 마지막에 제공해 주세요.\n"
                + "추가로 사용자에게 정보 전달을 위한 응답을 할 시에는 사용자가 궁금해할만한 질문을 3가지 추가로 응답하시오.\"\n"
                + "응답 형식은 아래와 같습니다.\n"
                +"ex)\n"
                + "{사용자가 궁금해했던 질문에 대한 응답}\n"
                + "관련 키워드입니다. 키워드1, 키워드2, 키워드3\n"
                + "Q1. 궁금해할만한 질문1\n"
                + "Q2. 궁금해할만한 질문2\n"
                + "Q3. 궁금해할만한 질문3\n";
        logger.info(augmentedPrompt);


        // ChatGPT API로 메시지 전송
        ChatResponseDto responseDto = sendMessageToApi(
                List.of(new ChatRequestDto.Message("user", augmentedPrompt)), 1000);

        // ChatGPT의 응답을 세션에 추가
        session.addMessage("assistant", responseDto.getText());
        logMessages(session.getMessages());

        return new ChatResponseDto("gpt", responseDto.getText());
    }

    @Override
    public void resetSession(boolean createReport) {
        if (createReport) {
            String report = generateReport();
            logger.info("Generated Report: {}", report);
        }
        this.session = ChatSessionManager.createNewSession(ChatConstants.INITIAL_GREETING, ChatConstants.ISSUE_SUMMARY);
    }

    private String generateReport() {
        StringBuilder reportBuilder = new StringBuilder();
        reportBuilder.append("챗봇 대화 세션 리포트\n");
        for (ChatRequestDto.Message message : session.getMessages()) {
            reportBuilder.append(message.getRole()).append(": ").append(message.getContent()).append("\n");
        }
        return reportBuilder.toString();
    }

    @Override
    public ChatResponseDto initializeSession() throws IOException {
        this.session = ChatSessionManager.createNewSession(ChatConstants.INITIAL_GREETING, ChatConstants.ISSUE_SUMMARY);

        // 오늘 날짜를 가져오고, 시간을 0시 0분 0초로 설정
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        Date today = calendar.getTime();

        System.out.println(today);

        // 오늘의 중요한 금융/경제 이슈 5개를 가져옴 (PageRequest를 사용)
        Pageable pageable = PageRequest.of(0, 5);  // 첫 번째 페이지에서 5개의 결과만 가져옴
        List<TodayIssue> todayIssues = todayIssueRepository.findTop5ByDateOrderByIdDesc(today, pageable);

        if (todayIssues.isEmpty()) {
            System.out.println("오늘의 이슈가 없습니다.");
        }

        // news_id 리스트 추출
        List<String> newsIds = todayIssues.stream()
                .map(issue -> issue.getNaverNewsEntity().getNewsId())
                .collect(Collectors.toList());

        // news_id로 naver_news 테이블에서 헤드라인 가져오기
        List<NaverNewsEntity> naverNewsEntities = naverNewsRepository.findByNewsIdIn(newsIds);

        // 헤드라인들을 이슈에 맞게 정리
        StringBuilder issueSummary = new StringBuilder();
        for (int i = 0; i < naverNewsEntities.size(); i++) {
            issueSummary.append(i + 1).append(". ")
                    .append(naverNewsEntities.get(i).getHeadline())
                    .append("\n");
        }
        System.out.println(issueSummary.toString());
        ChatRequestDto.Message questionMessage = new ChatRequestDto.Message("user", "아래 5개의 경제 이슈들을 조금 더 간결하게 바꿔서 "
                + "명사형 또는 뉴스 헤드라인 형식으로 만들어서 대답해줘\n"
                + issueSummary.toString()
                + "응답 형식은 아래와 같아\n" +
                "1. 이슈1~~~\n" +
                "2. 이슈2~~~\n" +
                "3. 이슈3~~~\n" +
                "4. 이슈3~~~\n" +
                "5. 이슈3~~~\n");
        ChatResponseDto responseDto = sendMessageToApi(List.of(questionMessage), 1000);

        String initialResponse = "AI 비서 입니다\n 어제 이슈 요약입니다.\n" + responseDto.getText();
        session.addMessage("assistant", initialResponse);
        logMessages(session.getMessages());

        return new ChatResponseDto("gpt", initialResponse);
    }

    private ChatResponseDto sendMessageToApi(List<ChatRequestDto.Message> messages, int maxTokens) throws IOException {
        ChatRequestDto requestDto = new ChatRequestDto();
        requestDto.setModel("gpt-4o-mini");
        requestDto.setMessages(messages);
        requestDto.setMax_tokens(maxTokens);

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

            JsonNode errorNode = jsonNode.get("error");
            if (errorNode != null) {
                String errorMessage = errorNode.get("message").asText();
                throw new IOException("OpenAI API error: " + errorMessage);
            }

            JsonNode choices = jsonNode.get("choices");
            if (choices != null && choices.isArray() && choices.size() > 0) {
                String chatResponse = choices.get(0).get("message").get("content").asText();
                return new ChatResponseDto("gpt", chatResponse);
            } else {
                throw new IOException("Unexpected API response format");
            }
        }
    }

    private void logMessages(List<ChatRequestDto.Message> messages) {
        StringBuilder logBuilder = new StringBuilder();
        logBuilder.append("현재 대화 내역:\n");
        for (ChatRequestDto.Message message : messages) {
            logBuilder.append(message.getRole()).append(": ").append(message.getContent()).append("\n");
        }
        logger.info(logBuilder.toString());
    }

    private String searchElasticsearchForArticles(String query) throws IOException {
        // ElasticsearchService를 사용하여 메서드 호출
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime fromDateTime = now.minusHours(24);

        // 날짜 및 시간 형식 설정 (ISO 8601 형식)
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

        // 문자열로 변환
        String fromDateTimeStr = fromDateTime.format(formatter);
        String toDateTimeStr = now.format(formatter);

        String requestBody = elasticsearchService.createElasticsearchRequest(query, fromDateTimeStr, toDateTimeStr);
        // 요청 바디 로그로 출력
        logger.info("Generated Elasticsearch Request Body: {}", requestBody);

        RequestBody body = RequestBody.create(
                MediaType.parse("application/json"), requestBody);

        Request request = new Request.Builder()
                .url("http://localhost:9200/naver_news/_search")
                .post(body)
                .build();

        try (Response response = client.newCall(request).execute()) {
            String responseBody = response.body().string();


            // Elasticsearch 응답을 JSON으로 파싱
            JsonNode jsonNode = objectMapper.readTree(responseBody);
            JsonNode hits = jsonNode.path("hits").path("hits");

            // 첫 번째 hit에서 content 추출
            if (hits.isArray() && hits.size() > 0) {
                JsonNode firstHit = hits.get(0);
                String content = firstHit.path("_source").path("content").asText();
                return content;
            } else {
                return "관련 기사를 찾을 수 없습니다.";
            }
        }
    }
}
