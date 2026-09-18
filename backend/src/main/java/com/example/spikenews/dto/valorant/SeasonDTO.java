package com.example.spikenews.dto.valorant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class SeasonDTO {
    private String uuid;
    private String displayName;
    private Date startTime;
    private Date endTime;
    private List<SeasonBorderDTO> borders;
    private String assetPath;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class SeasonBorderDTO {
        private String uuid;
        private Integer winsRequired;
        private Integer level;
        private String displayIcon;
        private String smallIcon;
        private String assetPath;
    }
}

