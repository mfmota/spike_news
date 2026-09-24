package com.spikenews.controller;

import com.spikenews.dto.MatchResponseDTO;
import com.spikenews.dto.MatchUpdateDTO;
import com.spikenews.service.MatchService;
import com.spikenews.service.SseService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/matches")
public class MatchController {

    private final MatchService matchService;
    private final SseService sseService;
    private final String internalApiKey;

    public MatchController(
            MatchService matchService,
            SseService sseService,
            @Value("${app.internal.api-key:spike-news-internal-scraper-key-2026}") String internalApiKey) {
        this.matchService = matchService;
        this.sseService = sseService;
        this.internalApiKey = internalApiKey;
    }

    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamMatches() {
        return sseService.createEmitter();
    }

    @GetMapping("/live")
    public ResponseEntity<List<MatchResponseDTO>> getLiveMatches() {
        return ResponseEntity.ok(matchService.getLiveMatches());
    }

    @GetMapping
    public ResponseEntity<List<MatchResponseDTO>> getAllMatches() {
        return ResponseEntity.ok(matchService.getAllMatches());
    }

    @PostMapping("/internal/update")
    public ResponseEntity<?> updateMatchFromInternalWorker(
            @RequestHeader(value = "X-Internal-Token", required = false) String token,
            @Valid @RequestBody MatchUpdateDTO matchUpdateDTO) {

        if (token == null || !token.equals(internalApiKey)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Acesso não autorizado: Token interno inválido ou ausente"));
        }

        MatchResponseDTO updated = matchService.processMatchUpdate(matchUpdateDTO);
        return ResponseEntity.ok(updated);
    }
}
