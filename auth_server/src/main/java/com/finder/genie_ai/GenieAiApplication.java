package com.finder.genie_ai;

import org.springframework.boot.Banner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.convert.threeten.Jsr310JpaConverters;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.WebApplicationInitializer;

@SpringBootApplication
@EntityScan(
		basePackages = { "com.finder.genie_ai.model" },
		basePackageClasses = {Jsr310JpaConverters.class})
@EnableJpaRepositories(basePackages = "com.finder.genie_ai.dao")
@EnableJpaAuditing
public class GenieAiApplication extends SpringBootServletInitializer {

	@Override
	protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
		return configureApplication(application);
	}

	public static void main(String[] args) {
		SpringApplication.run(GenieAiApplication.class, args);
	}

	private static SpringApplicationBuilder configureApplication(SpringApplicationBuilder builder) {
		return builder.sources(GenieAiApplication.class).bannerMode(Banner.Mode.OFF);
	}

}
