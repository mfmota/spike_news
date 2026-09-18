package com.example.spikenews.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final SecurityFilter securityFilter;

    public SecurityConfig(SecurityFilter securityFilter) {
        this.securityFilter = securityFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(authorize -> authorize
                        // Endpoints Públicos de Autenticação e Integração Interna (Webhooks / Scraper)
                        .requestMatchers(HttpMethod.POST, "/auth/login", "/auth/register", "/api/internal/**").permitAll()
                        .requestMatchers("/api/internal/**").permitAll()

                        // Leitura pública de notícias, placares, times e catálogo de assets do Valorant
                        .requestMatchers(HttpMethod.GET, "/news/**", "/matches/**", "/teams/**", "/api/catalog/**").permitAll()

                        // Endpoints exclusivos de Administrador
                        .requestMatchers("/admin/**").hasRole("ADMIN")

                        // Operações de CRUD de notícias e relatórios (Jornalista e Administrador)
                        .requestMatchers(HttpMethod.POST, "/news/**").hasAnyRole("JORNALISTA", "ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/news/**").hasAnyRole("JORNALISTA", "ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/news/**").hasAnyRole("JORNALISTA", "ADMIN")
                        .requestMatchers("/reports/**").hasAnyRole("JORNALISTA", "ADMIN")

                        // Gestão de preferências e notificações (Usuário autenticado)
                        .requestMatchers("/preferences/**", "/notifications/**").authenticated()

                        // Qualquer outro endpoint requer autenticação
                        .anyRequest().authenticated()
                )
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint((request, response, authException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpStatus.UNAUTHORIZED.value());
                            response.getWriter().write("{\"status\": 401, \"error\": \"Unauthorized\", \"message\": \"" + authException.getMessage() + "\"}");
                        })
                        .accessDeniedHandler((request, response, accessDeniedException) -> {
                            response.setContentType("application/json;charset=UTF-8");
                            response.setStatus(HttpStatus.FORBIDDEN.value());
                            response.getWriter().write("{\"status\": 403, \"error\": \"Forbidden\", \"message\": \"Acesso negado: permissão insuficiente\"}");
                        })
                )
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

