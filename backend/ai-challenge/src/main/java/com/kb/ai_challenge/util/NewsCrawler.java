package com.kb.ai_challenge.util;

import com.kb.ai_challenge.AiChallengeApplication;
import com.kb.ai_challenge.news.entity.NewsEntity;
import com.kb.ai_challenge.news.repository.NewsRepository;
import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import java.nio.file.Paths;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Component
public class NewsCrawler {
    private WebDriver driver;
    private WebDriverWait wait;

    @Autowired
    private NewsRepository newsRepository;

    public NewsCrawler() {
        String driverPath = Paths.get("chromedriver-win64", "chromedriver.exe").toString();
        System.setProperty("webdriver.chrome.driver", driverPath);
        this.driver = new ChromeDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10)); // 최대 10초 동안 기다립니다.
    }

    public void fetchNewsData() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy.MM.dd HH:mm");

        try {
            for (int page = 1; page <= 100; page++) {
                System.out.println("Accessing KB News website page " + page + "...");
                driver.get("https://kbthink.com/collect-view/News-List.html?sort=latest&pageNo=" + page);

                // 페이지의 특정 요소가 로드될 때까지 기다립니다.
                wait.until(ExpectedConditions.visibilityOfElementLocated(By.cssSelector(".total-news-comp__cont .news-comp")));

                System.out.println("Website accessed.");
                System.out.println("Fetching news links...");
                List<WebElement> newsLinks = driver.findElements(By.cssSelector(".total-news-comp__cont .news-comp"));
                List<String> newsUrls = new ArrayList<>();

                // 뉴스 URL 수집
                for (WebElement link : newsLinks) {
                    newsUrls.add(link.getAttribute("href"));
                }

                System.out.println("News links fetched: " + newsUrls.size());

                // 각 뉴스 URL을 순회하며 상세 정보 수집
                for (String url : newsUrls) {
                    System.out.println("Processing a news link...");
                    driver.get(url);

                    wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("news-view-comp__top__title")));

                    System.out.println("Fetching news details...");
                    String category = driver.findElement(By.className("news-view-comp__breadcrumb__category")).getText();
                    String date = driver.findElement(By.className("news-view-comp__top__info__date")).getText();
                    String headline = driver.findElement(By.className("news-view-comp__top__title")).getText();
                    String content = driver.findElement(By.className("news-view-comp__cont")).getText();

                    System.out.println("Category: " + category);
                    System.out.println("Date: " + date);
                    System.out.println("Headline: " + headline);
                    System.out.println("Content: " + content);

                    // 새로운 뉴스 엔티티 생성
                    NewsEntity newsEntity = new NewsEntity();
                    newsEntity.setHeadline(headline);
                    newsEntity.setContent(content);
                    newsEntity.setCategory(category);

                    // 날짜 형식을 파싱한 후 9시간을 더하여 한국 시간으로 변환
                    LocalDateTime localDateTime = LocalDateTime.parse(date, formatter);
                    LocalDateTime koreaDateTime = localDateTime.plusHours(9);
                    newsEntity.setDateTime(koreaDateTime);

                    // 중복 체크 및 저장
                    if (!newsRepository.existsByHeadline(headline)) {
                        newsRepository.save(newsEntity);
                        System.out.println("News saved successfully.");
                    } else {
                        System.out.println("Duplicate news found. Skipping...");
                    }
                }
            }
        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
            e.printStackTrace();
        } finally {
            driver.quit();
        }
    }

//    public static void main(String[] args) {
//        ApplicationContext context = SpringApplication.run(AiChallengeApplication.class, args);
//        NewsCrawler crawler = context.getBean(NewsCrawler.class);
//        crawler.fetchNewsData();
//    }
}
