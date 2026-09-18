package com.example.spikenews.service;

import com.example.spikenews.dto.valorant.AgentDTO;
import com.example.spikenews.dto.valorant.ValorantMapDTO;
import com.example.spikenews.exception.ResourceNotFoundException;
import com.example.spikenews.model.ValorantAgent;
import com.example.spikenews.model.ValorantMap;
import com.example.spikenews.repository.ValorantAgentRepository;
import com.example.spikenews.repository.ValorantMapRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ValorantCatalogService {

    private static final Logger log = LoggerFactory.getLogger(ValorantCatalogService.class);

    private final ValorantApiService apiService;
    private final ValorantAgentRepository agentRepository;
    private final ValorantMapRepository mapRepository;
    private final ObjectMapper objectMapper;

    public ValorantCatalogService(ValorantApiService apiService,
                                 ValorantAgentRepository agentRepository,
                                 ValorantMapRepository mapRepository,
                                 @org.springframework.beans.factory.annotation.Autowired(required = false) ObjectMapper objectMapper) {
        this.apiService = apiService;
        this.agentRepository = agentRepository;
        this.mapRepository = mapRepository;
        this.objectMapper = objectMapper != null ? objectMapper : new ObjectMapper();
    }

    @Transactional
    public void syncCatalog() {
        log.info("Iniciando sincronização e cache do catálogo da API do Valorant...");
        syncAgents();
        syncMaps();
        log.info("Sincronização do catálogo concluída com sucesso.");
    }

    @Transactional
    public void syncAgents() {
        try {
            List<AgentDTO> agentDTOs = apiService.getAgents(true, "pt-BR");
            if (agentDTOs == null || agentDTOs.isEmpty()) {
                log.warn("Nenhum agente retornado pela API externa.");
                return;
            }

            LocalDateTime now = LocalDateTime.now();
            List<ValorantAgent> agents = agentDTOs.stream().map(dto -> {
                String abilitiesJson = null;
                try {
                    abilitiesJson = objectMapper.writeValueAsString(dto.getAbilities());
                } catch (JsonProcessingException e) {
                    log.error("Erro ao serializar habilidades do agente {}: {}", dto.getDisplayName(), e.getMessage());
                }

                String tags = dto.getCharacterTags() != null ? String.join(",", dto.getCharacterTags()) : null;

                return ValorantAgent.builder()
                        .uuid(dto.getUuid())
                        .displayName(dto.getDisplayName())
                        .description(dto.getDescription())
                        .developerName(dto.getDeveloperName())
                        .characterTags(tags)
                        .displayIcon(dto.getDisplayIcon())
                        .bustPortrait(dto.getBustPortrait())
                        .fullPortrait(dto.getFullPortrait())
                        .assetPath(dto.getAssetPath())
                        .isFullPortraitRightFacing(dto.getIsFullPortraitRightFacing())
                        .isPlayableCharacter(dto.getIsPlayableCharacter())
                        .isAvailableForTest(dto.getIsAvailableForTest())
                        .roleUuid(dto.getRole() != null ? dto.getRole().getUuid() : null)
                        .roleDisplayName(dto.getRole() != null ? dto.getRole().getDisplayName() : null)
                        .roleDescription(dto.getRole() != null ? dto.getRole().getDescription() : null)
                        .roleDisplayIcon(dto.getRole() != null ? dto.getRole().getDisplayIcon() : null)
                        .abilitiesJson(abilitiesJson)
                        .lastSync(now)
                        .build();
            }).toList();

            agentRepository.saveAll(agents);
            log.info("{} agentes sincronizados e cacheados no SQLite.", agents.size());
        } catch (Exception e) {
            log.error("Erro durante a sincronização de agentes: {}", e.getMessage(), e);
        }
    }

    @Transactional
    public void syncMaps() {
        try {
            List<ValorantMapDTO> mapDTOs = apiService.getMaps("pt-BR");
            if (mapDTOs == null || mapDTOs.isEmpty()) {
                log.warn("Nenhum mapa retornado pela API externa.");
                return;
            }

            LocalDateTime now = LocalDateTime.now();
            List<ValorantMap> maps = mapDTOs.stream().map(dto -> ValorantMap.builder()
                    .uuid(dto.getUuid())
                    .displayName(dto.getDisplayName())
                    .coordinates(dto.getCoordinates())
                    .displayIcon(dto.getDisplayIcon())
                    .listViewIcon(dto.getListViewIcon())
                    .splash(dto.getSplash())
                    .mapUrl(dto.getMapUrl())
                    .xMultiplier(dto.getXMultiplier())
                    .yMultiplier(dto.getYMultiplier())
                    .xScalarToAdd(dto.getXScalarToAdd())
                    .yScalarToAdd(dto.getYScalarToAdd())
                    .lastSync(now)
                    .build()
            ).toList();

            mapRepository.saveAll(maps);
            log.info("{} mapas sincronizados e cacheados no SQLite.", maps.size());
        } catch (Exception e) {
            log.error("Erro durante a sincronização de mapas: {}", e.getMessage(), e);
        }
    }

    public List<ValorantAgent> getAllAgents() {
        List<ValorantAgent> agents = agentRepository.findByIsPlayableCharacterTrue();
        if (agents.isEmpty()) {
            agents = agentRepository.findAll();
        }
        return agents;
    }

    public ValorantAgent getAgentByUuid(String uuid) {
        return agentRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Agente não encontrado com UUID: " + uuid));
    }

    public List<ValorantMap> getAllMaps() {
        return mapRepository.findAll();
    }

    public ValorantMap getMapByUuid(String uuid) {
        return mapRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("Mapa não encontrado com UUID: " + uuid));
    }

    public long getAgentsCount() {
        return agentRepository.count();
    }

    public long getMapsCount() {
        return mapRepository.count();
    }
}
