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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

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
        if (updateDTO.getIdExterno() != null && !updateDTO.getIdExterno().isBlank()) {
            // 1. Tenta encontrar pelo ID exato do VLR
            match = matchRepository.findByIdExterno(updateDTO.getIdExterno())
                    .orElse(new Match());
            match.setIdExterno(updateDTO.getIdExterno());
        } else if (updateDTO.getIdPartida() != null) {
            // Fallback para o ID interno (se ainda usado por algum outro sistema)
            match = matchRepository.findById(updateDTO.getIdPartida())
                    .orElse(new Match());
        } else {
            // Fallback: Procura qualquer partida entre os times nas últimas semanas,
            // ignorando o status restrito
            List<Match> existing = matchRepository.findByTimeCasaIdOrTimeForaId(homeTeam.getId(), homeTeam.getId());
            Optional<Match> activeMatch = existing.stream()
                    .filter(m -> (m.getTimeCasa().getId().equals(homeTeam.getId())
                            && m.getTimeFora().getId().equals(awayTeam.getId())) ||
                            (m.getTimeCasa().getId().equals(awayTeam.getId())
                                    && m.getTimeFora().getId().equals(homeTeam.getId())))
                    // Removido o filtro restrito de status para evitar duplicar quando o jogo vira
                    // FINALIZADO
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

    public List<MatchResponseDTO> getMatchesByStatus(String statusStr, int limit) {
        MatchStatus status;
        try {
            status = MatchStatus.valueOf(statusStr);
        } catch (IllegalArgumentException e) {
            return List.of();
        }

        Sort sort = status == MatchStatus.FINALIZADO
                ? Sort.by(Sort.Direction.DESC, "dataPartida")
                : Sort.by(Sort.Direction.ASC, "dataPartida");

        Pageable pageable = PageRequest.of(0, limit, sort);

        return matchRepository.findByStatus(status, pageable)
                .stream()
                .map(MatchResponseDTO::new)
                .collect(Collectors.toList());
    }

    public List<MatchResponseDTO> getDefaultMatches(int limit) {
        List<MatchStatus> defaultStatuses = List.of(MatchStatus.AO_VIVO, MatchStatus.AGENDADO);

        Pageable pageable = PageRequest.of(0, limit, Sort.by(Sort.Direction.ASC, "dataPartida"));

        return matchRepository.findByStatusIn(defaultStatuses, pageable)
                .stream()
                .map(MatchResponseDTO::new)
                .collect(Collectors.toList());
    }
}
