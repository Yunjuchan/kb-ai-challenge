package com.kb.ai_challenge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.nio.file.Paths;

@EnableScheduling
@SpringBootApplication
public class AiChallengeApplication {

	public static void main(String[] args) {
		String driverPath = Paths.get("chromedriver-win64", "chromedriver.exe").toString();
		System.out.println("Chrome Driver Path: " + driverPath);
		SpringApplication.run(AiChallengeApplication.class, args);
	}

}
