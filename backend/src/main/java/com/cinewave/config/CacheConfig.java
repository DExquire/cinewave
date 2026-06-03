package com.cinewave.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import java.time.Duration;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Caffeine-backed cache. TMDB data changes slowly, so a short TTL dramatically cuts
 * upstream calls (and keeps us inside TMDB's rate limit) while staying fresh enough.
 */
@Configuration
public class CacheConfig {

    @Bean
    CacheManager cacheManager() {
        var manager = new CaffeineCacheManager();
        manager.setCaffeine(Caffeine.newBuilder()
                .maximumSize(1_000)
                .expireAfterWrite(Duration.ofMinutes(10)));
        return manager;
    }
}
