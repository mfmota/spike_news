package com.example.spikenews.service;

import com.example.spikenews.dto.valorant.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Collections;
import java.util.List;

@Service
public class ValorantApiService {

    private static final Logger log = LoggerFactory.getLogger(ValorantApiService.class);

    public static final String BASE_URL = "https://valorant-api.com/v1/";
    private final RestClient restClient;

    public ValorantApiService(@org.springframework.beans.factory.annotation.Autowired(required = false) RestClient.Builder restClientBuilder) {
        RestClient.Builder builder = restClientBuilder != null ? restClientBuilder : RestClient.builder();
        this.restClient = builder
                .baseUrl(BASE_URL)
                .defaultHeader("Accept", "application/json")
                .build();
    }

    public List<AgentDTO> getAgents(Boolean isPlayableCharacter, String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("agents")
                            .queryParam("isPlayableCharacter", isPlayableCharacter != null ? isPlayableCharacter : true)
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, res) -> {
                        log.error("Erro ao consultar agentes na API externa: Status {}", res.getStatusCode());
                    })
                    .body(new ParameterizedTypeReference<BaseModel<List<AgentDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha na comunicação com a API do Valorant (Agents): {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public AgentDTO getAgentByUuid(String uuid, String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("agents/{uuid}")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build(uuid))
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<AgentDTO>>() {});

            return response != null ? response.getData() : null;
        } catch (Exception e) {
            log.error("Falha ao buscar agente por uuid {}: {}", uuid, e.getMessage());
            return null;
        }
    }

    public List<ValorantMapDTO> getMaps(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("maps")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, (req, res) -> {
                        log.error("Erro ao consultar mapas na API externa: Status {}", res.getStatusCode());
                    })
                    .body(new ParameterizedTypeReference<BaseModel<List<ValorantMapDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha na comunicação com a API do Valorant (Maps): {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public ValorantMapDTO getMapByUuid(String uuid, String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("maps/{uuid}")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build(uuid))
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<ValorantMapDTO>>() {});

            return response != null ? response.getData() : null;
        } catch (Exception e) {
            log.error("Falha ao buscar mapa por uuid {}: {}", uuid, e.getMessage());
            return null;
        }
    }

    public List<WeaponDTO> getWeapons(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("weapons")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<WeaponDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar armas: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<BudyDTO> getBuddies(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("buddies")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<BudyDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar buddies: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<CardDTO> getCards(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("playercards")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<CardDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar cards: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<ContentTierDTO> getContentTiers() {
        try {
            var response = restClient.get()
                    .uri("contenttiers")
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<ContentTierDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar content tiers: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<CurrencyDTO> getCurrencies(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("currencies")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<CurrencyDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar moedas: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<GamemodeDTO> getGamemodes(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("gamemodes")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<GamemodeDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar modos de jogo: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<GamemodeEquippableDTO> getGamemodeEquippables(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("gamemodes/equippables")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<GamemodeEquippableDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar equippables: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<SeasonDTO> getSeasons(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("seasons")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<SeasonDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar temporadas: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<ThemeDTO> getThemes() {
        try {
            var response = restClient.get()
                    .uri("themes")
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<ThemeDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar temas: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public List<TitleDTO> getTitles(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("playertitles")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<TitleDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar titulos: {}", e.getMessage());
            return Collections.emptyList();
        }
    }

    public VersionDTO getVersion() {
        try {
            var response = restClient.get()
                    .uri("version")
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<VersionDTO>>() {});

            return response != null ? response.getData() : null;
        } catch (Exception e) {
            log.error("Falha ao buscar versao: {}", e.getMessage());
            return null;
        }
    }

    public List<SprayDTO> getSprays(String language) {
        try {
            var response = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("sprays")
                            .queryParam("language", language != null ? language : "pt-BR")
                            .build())
                    .retrieve()
                    .body(new ParameterizedTypeReference<BaseModel<List<SprayDTO>>>() {});

            return response != null && response.getData() != null ? response.getData() : Collections.emptyList();
        } catch (Exception e) {
            log.error("Falha ao buscar sprays: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
