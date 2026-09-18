package com.example.spikenews.dto.valorant;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;

import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties(ignoreUnknown = true)
public class AgentDTO {
    private String uuid;
    private String displayName;
    private String description;
    private String developerName;
    private List<String> characterTags;
    private String displayIcon;
    private String bustPortrait;
    private String fullPortrait;
    private String assetPath;
    private Boolean isFullPortraitRightFacing;
    private Boolean isPlayableCharacter;
    private Boolean isAvailableForTest;
    private AgentRoleDTO role;
    private List<AgentAbilityDTO> abilities;
}
