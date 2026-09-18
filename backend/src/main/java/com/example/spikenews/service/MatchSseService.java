package com.example.spikenews.service;

import com.example.spikenews.dto.match.MatchResponseDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class MatchSseService {

    private static final Logger log = LoggerFactory.getLogger(MatchSseService.class);

    // Timeout de 30 minutos por conexão (reconexão automática gerenciada pelo cliente SSE)
    private static final Long SSE_TIMEOUT = 30 * 60 * 1000L;

    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    /**
     * Registra uma nova conexão SSE para um cliente (Next.js / Frontend).
     */
    public SseEmitter subscribe(List<MatchResponseDTO> initialLiveMatches) {
        SseEmitter emitter = new SseEmitter(SSE_TIMEOUT);

        emitter.onCompletion(() -> {
            log.debug("SSE finalizado normalmente.");
            emitters.remove(emitter);
        });

        emitter.onTimeout(() -> {
            log.debug("SSE timeout.");
            emitter.complete();
            emitters.remove(emitter);
        });

        emitter.onError((e) -> {
            log.debug("SSE erro: {}", e.getMessage());
            emitter.complete();
            emitters.remove(emitter);
        });

        emitters.add(emitter);
        log.info("Novo cliente SSE conectado. Total de conexões ativas: {}", emitters.size());

        // Envia evento inicial de boas-vindas com o estado atual dos placares ao vivo
        try {
            emitter.send(SseEmitter.event()
                    .name("INIT")
                    .data(Map.of(
                            "message", "Conexão em tempo real estabelecida com sucesso.",
                            "liveMatches", initialLiveMatches
                    )));
        } catch (IOException e) {
            log.warn("Erro ao enviar evento INIT para novo cliente SSE: {}", e.getMessage());
            emitters.remove(emitter);
        }

        return emitter;
    }

    /**
     * Dispara atualização de um placar em tempo real para todos os clientes conectados.
     */
    public void broadcastMatch(MatchResponseDTO match) {
        if (emitters.isEmpty()) {
            return;
        }

        log.info("Disparando evento SSE de placar (Partida ID: {}, {} {} x {} {}) para {} clientes.",
                match.getId(),
                match.getTimeCasa() != null ? match.getTimeCasa().getNome() : "?",
                match.getPontuacaoCasa(),
                match.getPontuacaoFora(),
                match.getTimeFora() != null ? match.getTimeFora().getNome() : "?",
                emitters.size());

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("score-update")
                        .id(String.valueOf(match.getId()))
                        .data(match));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            log.debug("{} conexões SSE inativas foram removidas após tentativa de broadcast.", deadEmitters.size());
        }
    }

    /**
     * Dispara atualização de lote de placares.
     */
    public void broadcastBatch(List<MatchResponseDTO> matches) {
        if (emitters.isEmpty() || matches.isEmpty()) {
            return;
        }

        log.info("Disparando lote de {} placares via SSE para {} clientes conectados.",
                matches.size(), emitters.size());

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name("scores-batch-update")
                        .data(matches));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
        }
    }

    /**
     * Heartbeat a cada 25 segundos para manter os sockets HTTP abertos
     * e evitar fechamento por proxies/load-balancers.
     */
    @Scheduled(fixedRate = 25000)
    public void sendHeartbeat() {
        if (emitters.isEmpty()) {
            return;
        }

        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .comment("ping"));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
        }
    }

    public int getActiveConnectionsCount() {
        return emitters.size();
    }
}

