package com.example.spikenews;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SpikenewsApplication {

	public static void main(String[] args) {
		SpringApplication.run(SpikenewsApplication.class, args);
	}

}
