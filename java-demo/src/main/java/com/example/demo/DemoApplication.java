package com.example.demo;

import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.SingleColumnRowMapper;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClient;

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

}
