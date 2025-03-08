package com.sportapp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import static org.assertj.core.api.Assertions.assertThat;

@SpringBootTest
class SportAppApplicationTests {

    @Test
    void contextLoads() {
        assertThat(true).isTrue();
    }
}
