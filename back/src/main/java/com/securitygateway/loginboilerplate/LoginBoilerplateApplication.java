package com.securitygateway.loginboilerplate;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.retry.annotation.EnableRetry;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableCaching
@EnableAsync
@EnableRetry
public class LoginBoilerplateApplication {

    public static void main(String[] args) {
        SpringApplication.run(LoginBoilerplateApplication.class, args);
    }

}
