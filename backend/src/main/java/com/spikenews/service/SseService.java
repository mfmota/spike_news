package com.spikenews.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Service
public class SseService {

    private static final Logger logger = LoggerFactory.getLogger(SseService.class);
    private final List<SseEmitter> emitters = new CopyOnWriteArrayList<>();

    public SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(180_000L); // 3 minutos de timeout

        emitters.add(emitter);

        emitter.onCompletion(() -> {
            emitters.remove(emitter);
            logger.debug("Conexão SSE finalizada. Total ativo: {}", emitters.size());
        });

        emitter.onTimeout(() -> {
            emitters.remove(emitter);
            logger.debug("Conexão SSE expirada por timeout. Total ativo: {}", emitters.size());
        });

        emitter.onError(e -> {
            emitters.remove(emitter);
            logger.debug("Erro na conexão SSE: {}. Total ativo: {}", e.getMessage(), emitters.size());
        });

        try {
            emitter.send(SseEmitter.event()
                    .name("CONNECTED")
                    .data("Conexão SSE estabelecida com sucesso com o Spike News!"));
        } catch (IOException e) {
            emitters.remove(emitter);
        }

        return emitter;
    }

    public void broadcast(String eventName, Object data) {
        List<SseEmitter> deadEmitters = new CopyOnWriteArrayList<>();

        for (SseEmitter emitter : emitters) {
            try {
                emitter.send(SseEmitter.event()
                        .name(eventName)
                        .data(data));
            } catch (Exception e) {
                deadEmitters.add(emitter);
            }
        }

        if (!deadEmitters.isEmpty()) {
            emitters.removeAll(deadEmitters);
            logger.debug("Removidos {} emissores SSE inativos.", deadEmitters.size());
        }
    }

    public int getActiveConnectionsCount() {
        return emitters.size();
    }
}
