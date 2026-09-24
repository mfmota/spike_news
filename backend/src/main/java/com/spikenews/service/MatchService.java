package com.spikenews.service;

import com.spikenews.dto.MatchResponseDTO;
import com.spikenews.dto.MatchUpdateDTO;
import com.spikenews.model.Match;
import com.spikenews.model.MatchStatus;
import com.spikenews.model.Team;
import com.spikenews.repository.MatchRepository;
import com.spikenews.repository.TeamRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MatchService {

    private static final Logger logger = LoggerFactory.getLogger(MatchService.class);

    private final MatchRepository matchRepository;
    private final TeamRepository teamRepository;
    private final SseService sseService;
    private final NotificationService notificationService;

    public MatchService(
            MatchRepository matchRepository,
            TeamRepository teamRepository,
            SseService sseService,
            @Lazy NotificationService notificationService) {
        this.matchRepository = matchRepository;
        this.teamRepository = teamRepository;
        this.sseService = sseService;
        this.notificationService = notificationService;
    }

    @Transactional
    public MatchResponseDTO processMatchUpdate(MatchUpdateDTO updateDTO) {
        Team homeTeam = teamRepository.findByNomeIgnoreCase(updateDTO.getTimeCasa().trim())
                .orElseGet(() -> {
                    Team t = new Team(updateDTO.getTimeCasa().trim(), updateDTO.getLogoTimeCasa(), null);
                    return teamRepository.save(t);
                });

        Team awayTeam = teamRepository.findByNomeIgnoreCase(updateDTO.getTimeFora().trim())
                .orElseGet(() -> {
                    Team t = new Team(updateDTO.getTimeFora().trim(), updateDTO.getLogoTimeFora(), null);
                    return teamRepository.save(t);
                });

        if (updateDTO.getLogoTimeCasa() != null && !updateDTO.getLogoTimeCasa().isBlank()) {
            homeTeam.setUrlLogo(updateDTO.getLogoTimeCasa());
            teamRepository.save(homeTeam);
        }
        if (updateDTO.getLogoTimeFora() != null && !updateDTO.getLogoTimeFora().isBlank()) {
            awayTeam.setUrlLogo(updateDTO.getLogoTimeFora());
            teamRepository.save(awayTeam);
        }

        Match match;
        if (updateDTO.getIdPartida() != null) {
            match = matchRepository.findById(updateDTO.getIdPartida())
                    .orElse(new Match());
        } else {
            // Tenta encontrar partida recente entre esses dois times
            List<Match> existing = matchRepository.findByTimeCasaIdOrTimeForaId(homeTeam.getId(), homeTeam.getId());
            Optional<Match> activeMatch = existing.stream()
                    .filter(m -> (m.getTimeCasa().getId().equals(homeTeam.getId()) && m.getTimeFora().getId().equals(awayTeam.getId())) ||
                                 (m.getTimeCasa().getId().equals(awayTeam.getId()) && m.getTimeFora().getId().equals(homeTeam.getId())))
                    .filter(m -> m.getStatus() == MatchStatus.AO_VIVO || m.getStatus() == MatchStatus.AGENDADO)
                    .findFirst();

            match = activeMatch.orElse(new Match());
        }

        match.setTimeCasa(homeTeam);
        match.setTimeFora(awayTeam);
        match.setPontuacaoCasa(updateDTO.getPontuacaoCasa());
        match.setPontuacaoFora(updateDTO.getPontuacaoFora());
        match.setStatus(updateDTO.getStatus());
        match.setEvento(updateDTO.getEvento());
        match.setUpdatedAt(LocalDateTime.now());
        if (match.getDataPartida() == null) {
            match.setDataPartida(LocalDateTime.now());
        }

        Match savedMatch = matchRepository.save(match);
        MatchResponseDTO responseDTO = new MatchResponseDTO(savedMatch);

        // Dispara evento via SSE para todos os clientes conectados
        sseService.broadcast("match-update", responseDTO);
        logger.info("Partida atualizada e transmitida via SSE: {} vs {}", homeTeam.getNome(), awayTeam.getNome());

        // Dispara notificações para torcedores com preferências cadastradas
        notificationService.notifyUsersForMatch(savedMatch);

        return responseDTO;
    }

    public List<MatchResponseDTO> getLiveMatches() {
        return matchRepository.findByStatusOrderByDataPartidaDesc(MatchStatus.AO_VIVO)
                .stream()
                .map(MatchResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<MatchResponseDTO> getAllMatches() {
        return matchRepository.findAll()
                .stream()
                .map(MatchResponseDTO::new)
                .collect(Collectors.toList());
    }
}
