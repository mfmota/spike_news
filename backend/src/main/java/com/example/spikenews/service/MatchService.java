package com.example.spikenews.service;

import com.example.spikenews.dto.match.MatchIngestDTO;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class MatchService {

    private static final Logger log = LoggerFactory.getLogger(MatchService.class);

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final MatchSseService matchSseService;

    public MatchService(MatchRepository matchRepository,
                        TeamRepository teamRepository,
                        MatchSseService matchSseService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.matchSseService = matchSseService;
    }

    /**
     * Processa a atualização de partida enviada no formato MatchUpdateDTO (snake_case do Python Scraper)
     * e dispara a notificação em tempo real via SSE.
     */
    @Transactional
    public MatchResponseDTO processMatchUpdate(MatchUpdateDTO update) {
        MatchStatus matchStatus = MatchStatus.AO_VIVO;
        if (update.getStatus() != null && !update.getStatus().isBlank()) {
            String s = update.getStatus().trim().toUpperCase();
            if (s.contains("FINAL") || s.contains("COMPLET") || s.contains("ENCERRAD")) {
                matchStatus = MatchStatus.FINALIZADO;
            } else if (s.contains("AGENDAD") || s.contains("UPCOMING")) {
                matchStatus = MatchStatus.AGENDADO;
            } else {
                matchStatus = MatchStatus.AO_VIVO;
            }
        }

        MatchIngestDTO ingestDTO = MatchIngestDTO.builder()
                .idApiExterna(update.getMatchId())
                .urlMatch(update.getMatchUrl())
                .timeCasaNome(update.getTeamHome())
                .timeForaNome(update.getTeamAway())
                .pontuacaoCasa(update.getScoreHome())
                .pontuacaoFora(update.getScoreAway())
                .status(matchStatus)
                .torneio(update.getTournamentName())
                .faseTorneio(update.getTournamentStage())
                .tempoStatus(update.getEtaOrTime())
                .build();

        return processScrapedMatch(ingestDTO);
    }

    /**
     * Processa um lote de atualizações no formato MatchUpdateDTO.
     */
    @Transactional
    public List<MatchResponseDTO> processBatchMatchUpdates(List<MatchUpdateDTO> updates) {
        List<MatchResponseDTO> results = new ArrayList<>();
        for (MatchUpdateDTO update : updates) {
            results.add(processMatchUpdate(update));
        }
        return results;
    }

    /**
     * Processa, persiste/atualiza os dados de uma partida raspada pelo worker Python
     * e dispara a atualização para todos os clientes conectados via SSE.
     */
    @Transactional
    public MatchResponseDTO processScrapedMatch(MatchIngestDTO dto) {
        log.info("Processando dados de partida do scraper: {} vs {} (Placar: {}-{})",
                dto.getTimeCasaNome(), dto.getTimeForaNome(), dto.getPontuacaoCasa(), dto.getPontuacaoFora());

        Team teamCasa = findOrCreateTeam(dto.getTimeCasaNome(), dto.getTimeCasaLogo(), dto.getTimeCasaApiId());
        Team teamFora = findOrCreateTeam(dto.getTimeForaNome(), dto.getTimeForaLogo(), dto.getTimeForaApiId());

        Match match = findOrCreateMatch(dto, teamCasa, teamFora);

        match.setTimeCasa(teamCasa);
        match.setTimeFora(teamFora);
        match.setPontuacaoCasa(dto.getPontuacaoCasa() != null ? dto.getPontuacaoCasa() : 0);
        match.setPontuacaoFora(dto.getPontuacaoFora() != null ? dto.getPontuacaoFora() : 0);
        match.setStatus(dto.getStatus() != null ? dto.getStatus() : MatchStatus.AO_VIVO);
        match.setTorneio(dto.getTorneio());
        match.setFaseTorneio(dto.getFaseTorneio());
        match.setTempoStatus(dto.getTempoStatus());

        if (dto.getUrlMatch() != null && !dto.getUrlMatch().isBlank()) {
            match.setUrlMatch(dto.getUrlMatch());
        }
        if (dto.getIdApiExterna() != null && !dto.getIdApiExterna().isBlank()) {
            match.setIdApiExterna(dto.getIdApiExterna());
        }

        Match savedMatch = matchRepository.save(match);
        MatchResponseDTO responseDTO = MatchResponseDTO.fromEntity(savedMatch);

        // Dispara evento SSE em tempo real para os clientes conectados
        matchSseService.broadcastMatch(responseDTO);

        return responseDTO;
    }

    /**
     * Processa um lote de partidas raspadas pelo worker Python no formato MatchIngestDTO.
     */
    @Transactional
    public List<MatchResponseDTO> processBatchScrapedMatches(List<MatchIngestDTO> dtos) {
        List<MatchResponseDTO> results = new ArrayList<>();
        for (MatchIngestDTO dto : dtos) {
            results.add(processScrapedMatch(dto));
        }
        return results;
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getAllMatches() {
        return matchRepository.findAll().stream()
                .map(MatchResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<MatchResponseDTO> getLiveMatches() {
        return matchRepository.findByStatus(MatchStatus.AO_VIVO).stream()
                .map(MatchResponseDTO::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public MatchResponseDTO getMatchById(Long id) {
        Match match = matchRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Partida não encontrada com ID: " + id));
        return MatchResponseDTO.fromEntity(match);
    }

    private Team findOrCreateTeam(String nome, String urlLogo, String idApiExterna) {
        Optional<Team> existingTeam = Optional.empty();

        if (idApiExterna != null && !idApiExterna.isBlank()) {
            existingTeam = teamRepository.findByIdApiExterna(idApiExterna);
        }

        if (existingTeam.isEmpty() && nome != null && !nome.isBlank()) {
            existingTeam = teamRepository.findByNome(nome.trim());
        }

        if (existingTeam.isPresent()) {
            Team team = existingTeam.get();
            boolean updated = false;
            if ((team.getUrlLogo() == null || team.getUrlLogo().isBlank()) && urlLogo != null && !urlLogo.isBlank()) {
                team.setUrlLogo(urlLogo);
                updated = true;
            }
            if ((team.getIdApiExterna() == null || team.getIdApiExterna().isBlank()) && idApiExterna != null && !idApiExterna.isBlank()) {
                team.setIdApiExterna(idApiExterna);
                updated = true;
            }
            return updated ? teamRepository.save(team) : team;
        }

        Team newTeam = Team.builder()
                .nome(nome != null ? nome.trim() : "Desconhecido")
                .urlLogo(urlLogo)
                .idApiExterna(idApiExterna)
                .build();

        return teamRepository.save(newTeam);
    }

    private Match findOrCreateMatch(MatchIngestDTO dto, Team teamCasa, Team teamFora) {
        if (dto.getIdApiExterna() != null && !dto.getIdApiExterna().isBlank()) {
            Optional<Match> byExternalId = matchRepository.findByIdApiExterna(dto.getIdApiExterna().trim());
            if (byExternalId.isPresent()) {
                return byExternalId.get();
            }
        }

        // Tenta localizar partida ao vivo já existente entre os dois times
        List<Match> activeMatches = matchRepository.findByTimeCasaIdOrTimeForaId(teamCasa.getId(), teamCasa.getId());
        for (Match m : activeMatches) {
            boolean sameTeams = (m.getTimeCasa().getId().equals(teamCasa.getId()) && m.getTimeFora().getId().equals(teamFora.getId()))
                    || (m.getTimeCasa().getId().equals(teamFora.getId()) && m.getTimeFora().getId().equals(teamCasa.getId()));
            if (sameTeams && m.getStatus() == MatchStatus.AO_VIVO) {
                return m;
            }
        }

        return Match.builder()
                .idApiExterna(dto.getIdApiExterna())
                .timeCasa(teamCasa)
                .timeFora(teamFora)
                .status(MatchStatus.AO_VIVO)
                .build();
    }
}
