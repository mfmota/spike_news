package com.example.spikenews.dto.match;

import com.example.spikenews.model.Team;
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
public class TeamSummaryDTO {
    private Long id;
    private String idApiExterna;
    private String nome;
    private String urlLogo;

    public static TeamSummaryDTO fromEntity(Team team) {
        if (team == null) return null;
        return TeamSummaryDTO.builder()
                .id(team.getId())
                .idApiExterna(team.getIdApiExterna())
                .nome(team.getNome())
                .urlLogo(team.getUrlLogo())
                .build();
    }
}

