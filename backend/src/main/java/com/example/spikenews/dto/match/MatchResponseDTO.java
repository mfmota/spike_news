package com.example.spikenews.dto.match;

import com.example.spikenews.model.Match;
import com.example.spikenews.model.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MatchResponseDTO {

    private Long id;
    private String idApiExterna;
    private String urlMatch;
    private TeamSummaryDTO timeCasa;
    private TeamSummaryDTO timeFora;
    private Integer pontuacaoCasa;
    private Integer pontuacaoFora;
    private MatchStatus status;
    private String torneio;
    private String faseTorneio;
    private String tempoStatus;
    private Instant timestamp;

    public static MatchResponseDTO fromEntity(Match match) {
        if (match == null) return null;
        return MatchResponseDTO.builder()
                .id(match.getId())
                .idApiExterna(match.getIdApiExterna())
                .urlMatch(match.getUrlMatch())
                .timeCasa(TeamSummaryDTO.fromEntity(match.getTimeCasa()))
                .timeFora(TeamSummaryDTO.fromEntity(match.getTimeFora()))
                .pontuacaoCasa(match.getPontuacaoCasa())
                .pontuacaoFora(match.getPontuacaoFora())
                .status(match.getStatus())
                .torneio(match.getTorneio())
                .faseTorneio(match.getFaseTorneio())
                .tempoStatus(match.getTempoStatus())
                .timestamp(Instant.now())
                .build();
    }
}
