package com.spikenews.service;

import com.spikenews.integration.ValorantApiClient;
import com.spikenews.model.AgentCatalog;
import com.spikenews.model.MapCatalog;
import com.spikenews.model.WeaponCatalog;
import com.spikenews.repository.AgentCatalogRepository;
import com.spikenews.repository.MapCatalogRepository;
import com.spikenews.repository.WeaponCatalogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@EnableScheduling
public class CatalogService {

    private static final Logger logger = LoggerFactory.getLogger(CatalogService.class);

    private final ValorantApiClient apiClient;
    private final AgentCatalogRepository agentRepository;
    private final MapCatalogRepository mapRepository;
    private final WeaponCatalogRepository weaponRepository;

    public CatalogService(
            ValorantApiClient apiClient,
            AgentCatalogRepository agentRepository,
            MapCatalogRepository mapRepository,
            WeaponCatalogRepository weaponRepository) {
        this.apiClient = apiClient;
        this.agentRepository = agentRepository;
        this.mapRepository = mapRepository;
        this.weaponRepository = weaponRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    public void onStartup() {
        logger.info("Iniciando sincronização inicial de catálogo do Valorant...");
        syncCatalog();
    }

    @Scheduled(cron = "0 0 4 * * ?") // Executa diariamente às 04:00 AM
    public void scheduledSync() {
        logger.info("Executando sincronização agendada de catálogo do Valorant...");
        syncCatalog();
    }

    @Transactional
    public void syncCatalog() {
        try {
            List<AgentCatalog> agents = apiClient.fetchAgents();
            if (!agents.isEmpty()) {
                agentRepository.saveAll(agents);
                logger.info("Sincronizados {} agentes no SQLite.", agents.size());
            }

            List<MapCatalog> maps = apiClient.fetchMaps();
            if (!maps.isEmpty()) {
                mapRepository.saveAll(maps);
                logger.info("Sincronizados {} mapas no SQLite.", maps.size());
            }

            List<WeaponCatalog> weapons = apiClient.fetchWeapons();
            if (!weapons.isEmpty()) {
                weaponRepository.saveAll(weapons);
                logger.info("Sincronizadas {} armas no SQLite.", weapons.size());
            }
        } catch (Exception e) {
            logger.warn("Não foi possível sincronizar com a API externa agora: {}", e.getMessage());
        }
    }

    public List<AgentCatalog> getAllAgents() {
        return agentRepository.findAll();
    }

    public List<MapCatalog> getAllMaps() {
        return mapRepository.findAll();
    }

    public List<WeaponCatalog> getAllWeapons() {
        return weaponRepository.findAll();
    }
}
