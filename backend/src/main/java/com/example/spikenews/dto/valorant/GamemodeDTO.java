package com.example.spikenews.dto.valorant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class GamemodeDTO {
    private String uuid;
    private String displayName;
    private String duration;
    private Boolean isTeamVoiceAllowed;
    private Boolean isMinimapHidden;
    private Integer orbCount;
    private List<String> teamRoles;
    private List<OverriddenGameFeatureDTO> gameFeatureOverrides;
    private String displayIcon;
    private String assetPath;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class OverriddenGameFeatureDTO {
        private String featureName;
        private Boolean state;
    }
}

