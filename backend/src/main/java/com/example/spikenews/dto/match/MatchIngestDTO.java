package com.example.spikenews.dto.match;

import com.example.spikenews.model.enums.MatchStatus;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class MatchIngestDTO {

    private String idApiExterna;

    private String urlMatch;

    @NotBlank(message = "O nome do time da casa é obrigatório")
    private String timeCasaNome;

    private String timeCasaLogo;

    private String timeCasaApiId;

    @NotBlank(message = "O nome do time de fora é obrigatório")
    private String timeForaNome;

    private String timeForaLogo;

    private String timeForaApiId;

    @Builder.Default
    private Integer pontuacaoCasa = 0;

    @Builder.Default
    private Integer pontuacaoFora = 0;

    @Builder.Default
    private MatchStatus status = MatchStatus.AO_VIVO;

    private String torneio;

    private String faseTorneio;

    private String tempoStatus;
}

