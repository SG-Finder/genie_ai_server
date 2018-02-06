package com.finder.genie_ai;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;

@Configuration
@ComponentScan
@EnableAutoConfiguration
@EntityScan(
		basePackages = { "com.finder.genie_ai.model" },
		basePackageClasses = {Jsr310JpaConverters.class})
public class GenieAiApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return application.sources(GenieAiApplication.class);
	}

	public static void main(String[] args) {
		//System.getProperties().put("server.port", 8082);
		SpringApplication.run(GenieAiApplication.class, args);
	}

}
