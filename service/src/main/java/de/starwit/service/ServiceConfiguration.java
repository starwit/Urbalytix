package de.starwit.service;

import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.List;

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
import org.springframework.data.redis.connection.stream.ReadOffset;
import org.springframework.data.redis.connection.stream.StreamOffset;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.data.redis.stream.StreamMessageListenerContainer;
import org.springframework.data.redis.stream.Subscription;
import org.springframework.scheduling.annotation.EnableScheduling;

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

    @Value("${spring.data.redis.stream.ids:stream1}")
    private String[] streamIds;

    @Value("${spring.data.stream.prefix:aggregator}")
    private String redisStreamPrefix;

    @Value("${spring.data.redis.active:false}")
    private Boolean activateRedis;

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    StreamMessageListenerContainer<String, MapRecord<String, String, String>> streamMessageListenerContainer() {
        return StreamMessageListenerContainer.create(lettuceConnectionFactory());
    }

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
    public RedisTemplate<String, String> redisTemplate(RedisConnectionFactory connectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(connectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        return template;
    }

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    MessageListener messageListener() {
        return new MessageListener();
    }

    @Bean
    @ConditionalOnProperty(value = "spring.data.redis.active", havingValue = "true", matchIfMissing = false)
    public List<Subscription> subscription(RedisConnectionFactory redisConnectionFactory) throws UnknownHostException {
        List<Subscription> subscriptions = new ArrayList<>();
        for (String stream : streamIds) {
            StreamOffset<String> streamOffset = StreamOffset.create(redisStreamPrefix + ":" + stream,
                    ReadOffset.lastConsumed());
            Subscription subscription = streamMessageListenerContainer().receive(streamOffset,
                    messageListener());
            subscriptions.add(subscription);
        }
        streamMessageListenerContainer().start();
        return subscriptions;
    }

}
