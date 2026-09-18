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
public class AgentRoleDTO {
    private String uuid;
    private String displayName;
    private String description;
    private String displayIcon;
    private String assetPath;
}
