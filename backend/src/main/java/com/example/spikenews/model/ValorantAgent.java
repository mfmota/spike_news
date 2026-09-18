package com.example.spikenews.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDateTime;

@Entity
@Table(name = "valorant_agents")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ValorantAgent {

    @Id
    @Column(name = "uuid", length = 64)
    @EqualsAndHashCode.Include
    private String uuid;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "developer_name")
    private String developerName;

    @Column(name = "character_tags")
    private String characterTags;

    @Column(name = "display_icon")
    private String displayIcon;

    @Column(name = "bust_portrait")
    private String bustPortrait;

    @Column(name = "full_portrait")
    private String fullPortrait;

    @Column(name = "asset_path")
    private String assetPath;

    @Column(name = "is_full_portrait_right_facing")
    private Boolean isFullPortraitRightFacing;

    @Column(name = "is_playable_character")
    private Boolean isPlayableCharacter;

    @Column(name = "is_available_for_test")
    private Boolean isAvailableForTest;

    @Column(name = "role_uuid")
    private String roleUuid;

    @Column(name = "role_display_name")
    private String roleDisplayName;

    @Column(name = "role_description", columnDefinition = "TEXT")
    private String roleDescription;

    @Column(name = "role_display_icon")
    private String roleDisplayIcon;

    @Column(name = "abilities_json", columnDefinition = "TEXT")
    private String abilitiesJson;

    @Column(name = "last_sync")
    private LocalDateTime lastSync;
}

