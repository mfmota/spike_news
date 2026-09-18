package com.example.spikenews.service;

import com.example.spikenews.dto.match.MatchResponseDTO;
import com.example.spikenews.dto.match.MatchUpdateDTO;
import com.example.spikenews.exception.ResourceNotFoundException;
import com.example.spikenews.model.Match;
import com.example.spikenews.model.Team;
import com.example.spikenews.model.enums.MatchStatus;
import com.example.spikenews.repository.MatchRepository;
import com.example.spikenews.repository.TeamRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private static final Logger log = LoggerFactory.getLogger(MatchService.class);

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;

    public MatchService(MatchRepository matchRepository, TeamRepository teamRepository) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
    }

    @Transactional
    public MatchResponseDTO processMatchUpdate(MatchUpdateDTO dto) {
        if (dto == null || dto.getMatchId() == null) {
            throw new IllegalArgumentException("Dados de partida inválidos para atualização.");
        }

        // 1. Localiza ou cria a equipe mandante (Home)
        Team teamHome = teamRepository.findByNome(dto.getTeamHome())
                .orElseGet(() -> teamRepository.save(Team.builder()
                        .nome(dto.getTeamHome() != null ? dto.getTeamHome() : "Time Casa")
                        .build()));

        // 2. Localiza ou cria a equipe visitante (Away)
        Team teamAway = teamRepository.findByNome(dto.getTeamAway())
                .orElseGet(() -> teamRepository.save(Team.builder()
                        .nome(dto.getTeamAway() != null ? dto.getTeamAway() : "Time Fora")
                        .build()));

        // 3. Mapeia o status recebido para o enum MatchStatus
        MatchStatus matchStatus = mapStatus(dto.getStatus());

        // 4. Localiza partida existente pelo id externo ou cria uma nova
        Match match = matchRepository.findByIdApiExterna(dto.getMatchId())
                .orElse(Match.builder().idApiExterna(dto.getMatchId()).build());

        match.setTimeCasa(teamHome);
        match.setTimeFora(teamAway);
        match.setPontuacaoCasa(dto.getScoreHome());
        match.setPontuacaoFora(dto.getScoreAway());
        match.setStatus(matchStatus);
        match.setUrlMatch(dto.getMatchUrl());
        match.setTorneio(dto.getTournamentName());
        match.setFaseTorneio(dto.getTournamentStage());
        match.setTempoStatus(dto.getEtaOrTime());

        Match savedMatch = matchRepository.save(match);

        log.info("Partida sincronizada com sucesso: ID interno={}, ID externo={}, {} [{}] x [{}] {} ({})",
                savedMatch.getId(),
                savedMatch.getIdApiExterna(),
                teamHome.getNome(),
                savedMatch.getPontuacaoCasa(),
                savedMatch.getPontuacaoFora(),
                teamAway.getNome(),
                savedMatch.getStatus()
        );

        return MatchResponseDTO.fromEntity(savedMatch);
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getAllMatches() {
        return matchRepository.findAll().stream()
                .map(MatchResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getLiveMatches() {
        return matchRepository.findByStatus(MatchStatus.AO_VIVO).stream()
                .map(MatchResponseDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public MatchResponseDTO getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partida não encontrada com ID: " + id));
        return MatchResponseDTO.fromEntity(match);
    }

    private MatchStatus mapStatus(String rawStatus) {
        if (rawStatus == null) return MatchStatus.AO_VIVO;
        String statusUpper = rawStatus.trim().toUpperCase();
        return switch (statusUpper) {
            case "COMPLETED", "FINALIZADO" -> MatchStatus.FINALIZADO;
            case "UPCOMING", "AGENDADO" -> MatchStatus.AGENDADO;
            default -> MatchStatus.AO_VIVO;
        };
    }
}

