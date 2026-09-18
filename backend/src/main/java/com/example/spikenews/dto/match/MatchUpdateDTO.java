package com.example.spikenews.dto.match;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class MatchUpdateDTO {

    @JsonProperty("match_id")
    private String matchId;

    @JsonProperty("match_url")
    private String matchUrl;

    @JsonProperty("team_home")
    private String teamHome;

    @JsonProperty("team_away")
    private String teamAway;

    @JsonProperty("score_home")
    private Integer scoreHome;

    @JsonProperty("score_away")
    private Integer scoreAway;

    private String status;

    @JsonProperty("eta_or_time")
    private String etaOrTime;

    @JsonProperty("tournament_name")
    private String tournamentName;

    @JsonProperty("tournament_stage")
    private String tournamentStage;
}

