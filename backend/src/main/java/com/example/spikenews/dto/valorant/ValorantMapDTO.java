package com.example.spikenews.dto.valorant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class ValorantMapDTO {
    private String uuid;
    private String displayName;
    private String coordinates;
    private String displayIcon;
    private String listViewIcon;
    private String splash;
    private String mapUrl;
    private Double xMultiplier;
    private Double yMultiplier;
    private Double xScalarToAdd;
    private Double yScalarToAdd;
}
