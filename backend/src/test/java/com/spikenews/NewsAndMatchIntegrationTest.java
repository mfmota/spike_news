package com.spikenews;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.spikenews.dto.LoginRequestDTO;
import com.spikenews.dto.MatchUpdateDTO;
import com.spikenews.dto.NewsRequestDTO;
import com.spikenews.dto.RegisterRequestDTO;
import com.spikenews.model.MatchStatus;
import com.spikenews.model.Role;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class NewsAndMatchIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testAuthAndNewsCreationFlow() throws Exception {
        // 1. Registrar um novo jornalista de teste
        String uniqueEmail = "reporter_" + System.currentTimeMillis() + "@spikenews.gg";
        RegisterRequestDTO registerDTO = new RegisterRequestDTO(
                "Reporter Teste",
                uniqueEmail,
                "senha123",
                Role.JORNALISTA
        );

        MvcResult regResult = mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andReturn();

        String responseBody = regResult.getResponse().getContentAsString();
        String token = objectMapper.readTree(responseBody).get("token").asText();

        // 2. Criar uma nova matéria com o token do jornalista
        NewsRequestDTO newsDTO = new NewsRequestDTO(
                "Sentinels surpreende no split com novas táticas",
                "Em uma partida impecável, a Sentinels garantiu vitória avassaladora utilizando uma composição inovadora.",
                2L
        );

        mockMvc.perform(post("/api/news")
                        .header("Authorization", "Bearer " + token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newsDTO)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.titulo").value("Sentinels surpreende no split com novas táticas"))
                .andExpect(jsonPath("$.autorNome").value("Reporter Teste"));

        // 3. Consultar feed público de notícias
        mockMvc.perform(get("/api/news"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());

        // 4. Testar download de CSV público
        mockMvc.perform(get("/api/reports/public/stats/csv"))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", org.hamcrest.Matchers.containsString("text/csv")));

        // 5. Testar download de CSV do jornalista autenticado
        mockMvc.perform(get("/api/reports/journalist/news/csv")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(header().string("Content-Type", org.hamcrest.Matchers.containsString("text/csv")));
    }

    @Test
    void testInternalMatchUpdateWebhook() throws Exception {
        MatchUpdateDTO updateDTO = new MatchUpdateDTO(
                "LOUD",
                "https://owcdn.net/img/62a26569ecf20.png",
                "Sentinels",
                "https://owcdn.net/img/62a2679dc6e86.png",
                13,
                11,
                MatchStatus.AO_VIVO,
                "VCT Americas Grand Finals"
        );

        // Deve falhar com 401 se sem token interno
        mockMvc.perform(post("/api/matches/internal/update")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isUnauthorized());

        // Deve passar com token interno correto
        mockMvc.perform(post("/api/matches/internal/update")
                        .header("X-Internal-Token", "spike-news-internal-scraper-key-2026")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pontuacaoCasa").value(13))
                .andExpect(jsonPath("$.pontuacaoFora").value(11));
    }
}
