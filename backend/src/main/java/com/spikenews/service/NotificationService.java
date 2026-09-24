package com.spikenews.service;

import com.spikenews.dto.PreferenceDTO;
import com.spikenews.model.*;
import com.spikenews.repository.NotificationPreferenceRepository;
import com.spikenews.repository.TeamRepository;
import com.spikenews.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private static final Logger logger = LoggerFactory.getLogger(NotificationService.class);

    private final NotificationPreferenceRepository preferenceRepository;
    private final UserRepository userRepository;
    private final TeamRepository teamRepository;
    private final SseService sseService;

    public NotificationService(
            NotificationPreferenceRepository preferenceRepository,
            UserRepository userRepository,
            TeamRepository teamRepository,
            SseService sseService) {
        this.preferenceRepository = preferenceRepository;
        this.userRepository = userRepository;
        this.teamRepository = teamRepository;
        this.sseService = sseService;
    }

    public List<PreferenceDTO> getUserPreferences(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        return preferenceRepository.findByUsuarioId(user.getId())
                .stream()
                .map(pref -> new PreferenceDTO(
                        pref.getId(),
                        pref.getTime().getId(),
                        pref.getTime().getNome(),
                        pref.getTime().getUrlLogo(),
                        pref.getTipoAlerta()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public PreferenceDTO savePreference(String email, Long teamId, AlertType tipoAlerta) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Time não encontrado com ID: " + teamId));

        NotificationPreference preference = preferenceRepository.findByUsuarioIdAndTimeId(user.getId(), team.getId())
                .orElse(new NotificationPreference(user, team, tipoAlerta));

        preference.setTipoAlerta(tipoAlerta);
        NotificationPreference saved = preferenceRepository.save(preference);

        return new PreferenceDTO(
                saved.getId(),
                saved.getTime().getId(),
                saved.getTime().getNome(),
                saved.getTime().getUrlLogo(),
                saved.getTipoAlerta()
        );
    }

    @Transactional
    public void deletePreference(String email, Long teamId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        preferenceRepository.findByUsuarioIdAndTimeId(user.getId(), teamId)
                .ifPresent(preferenceRepository::delete);
    }

    public void notifyUsersForMatch(Match match) {
        if (match.getTimeCasa() == null || match.getTimeFora() == null) return;

        List<NotificationPreference> prefsHome = preferenceRepository.findByTimeId(match.getTimeCasa().getId());
        List<NotificationPreference> prefsAway = preferenceRepository.findByTimeId(match.getTimeFora().getId());

        List<NotificationPreference> targets = prefsHome.stream()
                .filter(p -> p.getTipoAlerta() == AlertType.JOGOS || p.getTipoAlerta() == AlertType.AMBOS)
                .collect(Collectors.toList());

        targets.addAll(prefsAway.stream()
                .filter(p -> p.getTipoAlerta() == AlertType.JOGOS || p.getTipoAlerta() == AlertType.AMBOS)
                .toList());

        for (NotificationPreference target : targets) {
            logger.info("Notificação de Jogo enviada para {} [Time: {} | Status: {}]: {} {} x {} {}",
                    target.getUsuario().getEmail(),
                    target.getTime().getNome(),
                    match.getStatus(),
                    match.getTimeCasa().getNome(),
                    match.getPontuacaoCasa(),
                    match.getPontuacaoFora(),
                    match.getTimeFora().getNome());
        }
    }

    public void notifyUsersForNews(News news) {
        if (news.getTimeRelacionado() == null) return;

        List<NotificationPreference> prefs = preferenceRepository.findByTimeId(news.getTimeRelacionado().getId());
        List<NotificationPreference> targets = prefs.stream()
                .filter(p -> p.getTipoAlerta() == AlertType.NOTICIAS || p.getTipoAlerta() == AlertType.AMBOS)
                .toList();

        for (NotificationPreference target : targets) {
            logger.info("Notificação de Notícia enviada para {} [Time: {}]: '{}'",
                    target.getUsuario().getEmail(),
                    target.getTime().getNome(),
                    news.getTitulo());
        }
    }
}
