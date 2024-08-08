package com.example.demo;

import io.opentelemetry.api.trace.Span;
import jakarta.annotation.Resource;
import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpFilter;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

import java.io.IOException;

@Slf4j
@RestController
@SpringBootApplication
public class DemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(DemoApplication.class, args);
    }

    @Resource
    JdbcTemplate jdbcTemplate;

    RestClient restClient = RestClient.create();

    @GetMapping("/")
    String hello() {
        log.info("hello log");
        return "hello log";
    }

    @GetMapping("/mysql")
    String mysql() {
        return jdbcTemplate.queryForObject("select version()", SingleColumnRowMapper.newInstance(String.class));
    }

    @GetMapping("/http")
    String http() {
        return restClient.get().uri("http://www.baidu.com").retrieve().body(String.class);
    }

    @Bean
    Filter traceFilter() {
        return new HttpFilter() {
            @Override
            protected void doFilter(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws IOException, ServletException {
                String traceId = Span.current().getSpanContext().getTraceId();
                response.addHeader("trace-id", traceId);
                super.doFilter(request, response, chain);
            }
        };
    }
}
