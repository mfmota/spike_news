package com.example.spikenews.controller;

import com.example.spikenews.dto.match.MatchResponseDTO;
import com.example.spikenews.dto.match.MatchUpdateDTO;
import com.example.spikenews.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/internal/matches")
public class InternalMatchController {

    private final MatchService matchService;

    public InternalMatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    @PostMapping("/update")
    public ResponseEntity<MatchResponseDTO> receiveMatchUpdate(@RequestBody MatchUpdateDTO matchUpdate) {
        MatchResponseDTO updatedMatch = matchService.processMatchUpdate(matchUpdate);
        return ResponseEntity.ok(updatedMatch);
    }

    @PostMapping("/batch")
    public ResponseEntity<List<MatchResponseDTO>> receiveBatchMatchUpdates(@RequestBody List<MatchUpdateDTO> matchUpdates) {
        List<MatchResponseDTO> updatedMatches = matchService.processBatchMatchUpdates(matchUpdates);
        return ResponseEntity.ok(updatedMatches);
    }
}
