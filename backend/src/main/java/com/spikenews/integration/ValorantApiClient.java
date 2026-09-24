package com.spikenews.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.spikenews.model.AgentCatalog;
import com.spikenews.model.MapCatalog;
import com.spikenews.model.WeaponCatalog;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

import javax.net.ssl.*;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.List;

@Component
public class ValorantApiClient {

    private static final Logger logger = LoggerFactory.getLogger(ValorantApiClient.class);

    private final RestClient restClient;
    private final String language;
    private final ObjectMapper objectMapper;

    public ValorantApiClient(
            @Value("${valorant.api.base-url:https://valorant-api.com/v1}") String baseUrl,
            @Value("${valorant.api.language:pt-BR}") String language) {
        this.language = language;
        this.objectMapper = new ObjectMapper();

        RestClient client;
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{
                new X509TrustManager() {
                    public X509Certificate[] getAcceptedIssuers() { return null; }
                    public void checkClientTrusted(X509Certificate[] certs, String authType) {}
                    public void checkServerTrusted(X509Certificate[] certs, String authType) {}
                }
            };

            SSLContext sc = SSLContext.getInstance("TLS");
            sc.init(null, trustAllCerts, new java.security.SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier((hostname, session) -> true);

            SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
            factory.setConnectTimeout(5000);
            factory.setReadTimeout(5000);

            client = RestClient.builder()
                    .baseUrl(baseUrl)
                    .requestFactory(factory)
                    .build();
        } catch (Exception e) {
            client = RestClient.builder().baseUrl(baseUrl).build();
        }
        this.restClient = client;
    }

    public List<AgentCatalog> fetchAgents() {
        List<AgentCatalog> agents = new ArrayList<>();
        try {
            String jsonResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/agents")
                            .queryParam("isPlayableCharacter", "true")
                            .queryParam("language", language)
                            .build())
                    .retrieve()
                    .body(String.class);

            if (jsonResponse != null) {
                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode dataNode = root.get("data");
                if (dataNode != null && dataNode.isArray()) {
                    for (JsonNode item : dataNode) {
                        String uuid = item.path("uuid").asText();
                        String displayName = item.path("displayName").asText();
                        String description = item.path("description").asText();
                        String developerName = item.path("developerName").asText();
                        String displayIcon = item.path("displayIcon").asText();
                        String fullPortrait = item.path("fullPortrait").asText();

                        String roleName = item.path("role").path("displayName").asText(null);
                        String roleIcon = item.path("role").path("displayIcon").asText(null);

                        agents.add(new AgentCatalog(uuid, displayName, description, developerName, displayIcon, fullPortrait, roleName, roleIcon));
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Aviso ao buscar agentes da API externa (usando fallback seguro): {}", e.getMessage());
            agents.addAll(getFallbackAgents());
        }
        return agents;
    }

    public List<MapCatalog> fetchMaps() {
        List<MapCatalog> maps = new ArrayList<>();
        try {
            String jsonResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/maps")
                            .queryParam("language", language)
                            .build())
                    .retrieve()
                    .body(String.class);

            if (jsonResponse != null) {
                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode dataNode = root.get("data");
                if (dataNode != null && dataNode.isArray()) {
                    for (JsonNode item : dataNode) {
                        String uuid = item.path("uuid").asText();
                        String displayName = item.path("displayName").asText();
                        String coordinates = item.path("coordinates").asText();
                        String displayIcon = item.path("displayIcon").asText();
                        String splash = item.path("splash").asText();

                        maps.add(new MapCatalog(uuid, displayName, coordinates, displayIcon, splash));
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Aviso ao buscar mapas da API externa (usando fallback seguro): {}", e.getMessage());
            maps.addAll(getFallbackMaps());
        }
        return maps;
    }

    public List<WeaponCatalog> fetchWeapons() {
        List<WeaponCatalog> weapons = new ArrayList<>();
        try {
            String jsonResponse = restClient.get()
                    .uri(uriBuilder -> uriBuilder
                            .path("/weapons")
                            .queryParam("language", language)
                            .build())
                    .retrieve()
                    .body(String.class);

            if (jsonResponse != null) {
                JsonNode root = objectMapper.readTree(jsonResponse);
                JsonNode dataNode = root.get("data");
                if (dataNode != null && dataNode.isArray()) {
                    for (JsonNode item : dataNode) {
                        String uuid = item.path("uuid").asText();
                        String displayName = item.path("displayName").asText();
                        String category = item.path("category").asText();
                        String displayIcon = item.path("displayIcon").asText();

                        Integer cost = item.path("shopData").has("cost") ? item.path("shopData").path("cost").asInt() : null;
                        Integer magSize = item.path("weaponStats").has("magazineSize") ? item.path("weaponStats").path("magazineSize").asInt() : null;
                        Float fireRate = item.path("weaponStats").has("fireRate") ? (float) item.path("weaponStats").path("fireRate").asDouble() : null;

                        weapons.add(new WeaponCatalog(uuid, displayName, category, displayIcon, cost, magSize, fireRate));
                    }
                }
            }
        } catch (Exception e) {
            logger.warn("Aviso ao buscar armas da API externa (usando fallback seguro): {}", e.getMessage());
            weapons.addAll(getFallbackWeapons());
        }
        return weapons;
    }

    private List<AgentCatalog> getFallbackAgents() {
        return List.of(
            new AgentCatalog("jett-uuid", "Jett", "Representando a Coreia do Sul, sua agilidade e estilo de luta evasivo permitem que ela assuma riscos que ninguém mais conseguiria.", "Wushu", "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/displayicon.png", "https://media.valorant-api.com/agents/add6443a-41bd-e414-f6ad-e58d267f4e95/fullportrait.png", "Duelista", "https://media.valorant-api.com/agents/roles/dbe8757e-9e92-4ed4-b39f-9dfc589691d4/displayicon.png"),
            new AgentCatalog("sova-uuid", "Sova", "Nascido no inverno eterno da tundra russa, Sova rastreia, encontra e elimina inimigos com eficiência e precisão implacáveis.", "Hunter", "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/displayicon.png", "https://media.valorant-api.com/agents/320b2a48-4d9b-a075-30f1-1f93a9b638fa/fullportrait.png", "Iniciador", "https://media.valorant-api.com/agents/roles/1b47567f-8f7b-444b-a003-c64b09464409/displayicon.png"),
            new AgentCatalog("omen-uuid", "Omen", "Omen caça nas sombras. Ele cega os inimigos, teleporta pelo campo de batalha e deixa a paranoia tomar conta dos adversários.", "Wraith", "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/displayicon.png", "https://media.valorant-api.com/agents/8e253930-4c05-31dd-1b6c-968525494517/fullportrait.png", "Controlador", "https://media.valorant-api.com/agents/roles/4ee40330-ecdd-4f2f-98ab-ff5695adbea8/displayicon.png")
        );
    }

    private List<MapCatalog> getFallbackMaps() {
        return List.of(
            new MapCatalog("ascent-uuid", "Ascent", "45°26'15\" N 12°20'9\" E", "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/displayicon.png", "https://media.valorant-api.com/maps/7eaecc1b-4337-bbf6-6ab9-04b8f06b3319/splash.png"),
            new MapCatalog("haven-uuid", "Haven", "27°28'0\" N 89°38'0\" E", "https://media.valorant-api.com/maps/2bee0c3d-4c46-302a-0c04-159a31d18329/displayicon.png", "https://media.valorant-api.com/maps/2bee0c3d-4c46-302a-0c04-159a31d18329/splash.png"),
            new MapCatalog("bind-uuid", "Bind", "34°2'0\" N 6°51'0\" W", "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/displayicon.png", "https://media.valorant-api.com/maps/2c9d57ec-4431-9c5e-2939-8f9ef6dd5cba/splash.png")
        );
    }

    private List<WeaponCatalog> getFallbackWeapons() {
        return List.of(
            new WeaponCatalog("vandal-uuid", "Vandal", "Fuzis", "https://media.valorant-api.com/weapons/9c82e19d-4575-0200-1a81-3eacf00cd872/displayicon.png", 2900, 25, 9.75f),
            new WeaponCatalog("phantom-uuid", "Phantom", "Fuzis", "https://media.valorant-api.com/weapons/ee8e8d15-496b-07ac-e5f6-8fae5d4c7b1a/displayicon.png", 2900, 30, 11.0f),
            new WeaponCatalog("operator-uuid", "Operator", "Fuzis de Precisão", "https://media.valorant-api.com/weapons/a03b24d3-4319-996d-0f8c-94bbfba1dfc7/displayicon.png", 4700, 5, 0.6f)
        );
    }
}
