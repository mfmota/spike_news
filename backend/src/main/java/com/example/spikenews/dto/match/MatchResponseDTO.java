package com.example.spikenews.dto.match;

import com.example.spikenews.model.Match;
import com.example.spikenews.model.enums.MatchStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchResponseDTO {

    private Long id;
    private String idApiExterna;
    private String urlMatch;
    private Long idTimeCasa;
    private String nomeTimeCasa;
    private String logoTimeCasa;
    private Long idTimeFora;
    private String nomeTimeFora;
    private String logoTimeFora;
    private Integer pontuacaoCasa;
    private Integer pontuacaoFora;
    private MatchStatus status;
    private String torneio;
    private String faseTorneio;
    private String tempoStatus;

    public static MatchResponseDTO fromEntity(Match match) {
        if (match == null) return null;
        return MatchResponseDTO.builder()
                .id(match.getId())
                .idApiExterna(match.getIdApiExterna())
                .urlMatch(match.getUrlMatch())
                .idTimeCasa(match.getTimeCasa() != null ? match.getTimeCasa().getId() : null)
                .nomeTimeCasa(match.getTimeCasa() != null ? match.getTimeCasa().getNome() : null)
                .logoTimeCasa(match.getTimeCasa() != null ? match.getTimeCasa().getUrlLogo() : null)
                .idTimeFora(match.getTimeFora() != null ? match.getTimeFora().getId() : null)
                .nomeTimeFora(match.getTimeFora() != null ? match.getTimeFora().getNome() : null)
                .logoTimeFora(match.getTimeFora() != null ? match.getTimeFora().getUrlLogo() : null)
                .pontuacaoCasa(match.getPontuacaoCasa())
                .pontuacaoFora(match.getPontuacaoFora())
                .status(match.getStatus())
                .torneio(match.getTorneio())
                .faseTorneio(match.getFaseTorneio())
                .tempoStatus(match.getTempoStatus())
                .build();
    }
}

