package com.example.spikenews.controller;

import com.example.spikenews.dto.match.MatchIngestDTO;
import com.example.spikenews.dto.match.MatchResponseDTO;
import com.example.spikenews.service.MatchService;
import com.example.spikenews.service.MatchSseService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;
    private final MatchSseService matchSseService;

    public MatchController(MatchService matchService, MatchSseService matchSseService) {
        this.matchService = matchService;
        this.matchSseService = matchSseService;
    }

    /**
     * Endpoint SSE para streaming de placares em tempo real para o frontend Next.js.
     * Retorna um SseEmitter que mantém a conexão aberta.
     */
    @GetMapping(value = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter streamMatches() {
        List<MatchResponseDTO> initialLiveMatches = matchService.getLiveMatches();
        return matchSseService.subscribe(initialLiveMatches);
    }

    /**
     * Endpoint POST para recepção de dados raspados pelo Worker Python.
     * Atualiza/salva no SQLite e automaticamente dispara o evento SSE para todos os clientes conectados.
     */
    @PostMapping("/ingest")
    public ResponseEntity<MatchResponseDTO> ingestMatch(@Valid @RequestBody MatchIngestDTO dto) {
        MatchResponseDTO response = matchService.processScrapedMatch(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /**
     * Endpoint POST para recepção em lote de partidas do Scraper.
     */
    @PostMapping("/ingest/batch")
    public ResponseEntity<List<MatchResponseDTO>> ingestBatchMatches(@Valid @RequestBody List<MatchIngestDTO> dtos) {
        List<MatchResponseDTO> responses = matchService.processBatchScrapedMatches(dtos);
        return ResponseEntity.ok(responses);
    }

    /**
     * Retorna todas as partidas cadastradas no banco de dados.
     */
    @GetMapping
    public ResponseEntity<List<MatchResponseDTO>> getAllMatches() {
        List<MatchResponseDTO> matches = matchService.getAllMatches();
        return ResponseEntity.ok(matches);
    }

    /**
     * Retorna todas as partidas atualmente AO_VIVO.
     */
    @GetMapping("/live")
    public ResponseEntity<List<MatchResponseDTO>> getLiveMatches() {
        List<MatchResponseDTO> liveMatches = matchService.getLiveMatches();
        return ResponseEntity.ok(liveMatches);
    }

    /**
     * Retorna uma partida específica por ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MatchResponseDTO> getMatchById(@PathVariable Long id) {
        MatchResponseDTO match = matchService.getMatchById(id);
        return ResponseEntity.ok(match);
    }
}
