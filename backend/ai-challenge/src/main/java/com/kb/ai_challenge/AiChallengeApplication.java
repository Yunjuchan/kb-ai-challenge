package com.kb.ai_challenge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

import java.nio.file.Paths;

@EnableScheduling
@SpringBootApplication
public class AiChallengeApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiChallengeApplication.class, args);
	}
}
