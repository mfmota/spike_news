package com.example.spikenews.dto.valorant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class CardDTO {
    private String uuid;
    private String displayName;
    private Boolean isHiddenIfNotOwner;
    private String displayIcon;
    private String smallArt;
    private String wideArt;
    private String largeArt;
    private String assetPath;
}

