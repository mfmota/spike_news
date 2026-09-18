package com.example.spikenews.config;

import com.example.spikenews.service.ValorantCatalogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.concurrent.CompletableFuture;

@Component
public class CatalogSyncScheduler {

    private static final Logger log = LoggerFactory.getLogger(CatalogSyncScheduler.class);

    private final ValorantCatalogService catalogService;

    public CatalogSyncScheduler(ValorantCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    /**
     * Carga inicial na inicialização da aplicação:
     * Se o banco de dados estiver vazio, dispara a sincronização assincronamente
     * para não travar o boot da aplicação.
     */
    @EventListener(ApplicationReadyEvent.class)
    public void onApplicationReady() {
        CompletableFuture.runAsync(() -> {
            try {
                if (catalogService.getAgentsCount() == 0 || catalogService.getMapsCount() == 0) {
                    log.info("Catálogo local de agentes/mapas está vazio. Iniciando carga inicial da valorant-api.com...");
                    catalogService.syncCatalog();
                } else {
                    log.info("Catálogo local já populado (Agentes: {}, Mapas: {}).",
                            catalogService.getAgentsCount(), catalogService.getMapsCount());
                }
            } catch (Exception e) {
                log.error("Erro na carga inicial do catálogo: {}", e.getMessage());
            }
        });
    }

    /**
     * Sincronização periódica agendada (uma vez ao dia, às 03:00 da madrugada)
     * para manter os assets e novos agentes/mapas atualizados sem sobrecarregar a API pública.
     */
    @Scheduled(cron = "0 0 3 * * *")
    public void scheduledCatalogRefresh() {
        log.info("Executando sincronização agendada do catálogo de assets do Valorant...");
        catalogService.syncCatalog();
    }
}
