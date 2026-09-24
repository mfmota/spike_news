package com.spikenews.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtTokenProviderTest {

    private JwtTokenProvider tokenProvider;
    private final String secret = "TestSecretKeySuperSecureJwtTokenMustBeAtLeast256BitsLong2026!";
    private final long expirationMs = 3600000; // 1 hora

    @BeforeEach
    void setUp() {
        tokenProvider = new JwtTokenProvider(secret, expirationMs);
    }

    @Test
    void testGenerateAndValidateToken() {
        String username = "player@spikenews.gg";
        String token = tokenProvider.generateToken(username);

        assertNotNull(token);
        assertTrue(tokenProvider.validateToken(token));
        assertEquals(username, tokenProvider.getUsernameFromToken(token));
    }

    @Test
    void testInvalidToken() {
        assertFalse(tokenProvider.validateToken("invalid.token.here"));
    }
}
