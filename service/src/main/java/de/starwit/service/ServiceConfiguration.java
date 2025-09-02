package de.starwit.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.connection.stream.MapRecord;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.scheduling.annotation.EnableScheduling;

import de.starwit.service.messagelistener.DetectionCountMessageListener;
import de.starwit.service.messagelistener.PositionMessageListener;
import io.lettuce.core.ClientOptions;
import io.lettuce.core.ClientOptions.DisconnectedBehavior;

@SpringBootApplication
@EnableScheduling
@ComponentScan(basePackages = "de.starwit.persistence")
public class ServiceConfiguration {

    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.active:false}")
    private Boolean activateRedis;

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    LettuceConnectionFactory lettuceConnectionFactory() {
        RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration(redisHost, redisPort);
        ClientOptions options = ClientOptions.builder().autoReconnect(true)
                .disconnectedBehavior(DisconnectedBehavior.REJECT_COMMANDS).build();
        LettuceClientConfiguration clientConfig = LettucePoolingClientConfiguration.builder().clientOptions(options)
                .build();
        LettuceConnectionFactory factory = new LettuceConnectionFactory(redisConfig,
                clientConfig);
        factory.setShareNativeConnection(false);
        return factory;
    }

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamMessageListenerContainer() {
        return StreamMessageListenerContainer.create(lettuceConnectionFactory());
    }

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    DetectionCountMessageListener detectionCountMessageListener() {
        return new DetectionCountMessageListener();
    }

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    PositionMessageListener positionMessageListener() {
        return new PositionMessageListener();
    }
}
