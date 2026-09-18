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
public class WeaponDTO {
    private String uuid;
    private String displayName;
    private String category;
    private String defaultSkinUuid;
    private String killStreamIcon;
    private String assetPath;
    private WeaponStatsDTO weaponStats;
    private WeaponShopDataDTO shopData;
    private List<WeaponSkinDTO> skins;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponStatsDTO {
        private Float fireRate;
        private Integer magazineSize;
        private Float runSpeedMultiplier;
        private Float equipTimeSeconds;
        private Float reloadTimeSeconds;
        private Float firstBulletAccuracy;
        private Integer shotgunPelletCount;
        private String wallPenetration;
        private String feature;
        private String fireMode;
        private String altFireType;
        private WeaponAdsStatsDTO adsStats;
        private WeaponsShotgunStatsDTO altShotgunStats;
        private WeaponsBurstStatsDTO airBurstStats;
        private List<WeaponDamageRangeDTO> damageRanges;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponsShotgunStatsDTO {
        private Integer shotgunPelletCount;
        private Float burstRate;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponsBurstStatsDTO {
        private Integer shotgunPelletCount;
        private Float burstsDistance;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponShopDataDTO {
        private Integer cost;
        private String category;
        private String categoryText;
        private WeaponShopDataGridPositionDTO gridPosition;
        private String image;
        private String newImage;
        private String newImage2;
        private String assetPath;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponDamageRangeDTO {
        private Float rangeStartsMeters;
        private Float rangeEndMeters;
        private Float headDamage;
        private Float bodyDamage;
        private Float legDamage;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponAdsStatsDTO {
        private Float zoomMultiplier;
        private Float fireRate;
        private Float runSpeedMultiplier;
        private Integer burstCount;
        private Float firstBulletAccuracy;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponShopDataGridPositionDTO {
        private Integer row;
        private Integer column;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponSkinDTO {
        private String uuid;
        private String displayName;
        private String themeUuid;
        private String contentTierUuid;
        private String displayIcon;
        private String assetPath;
        private List<WeaponSkinChromaDTO> chromas;
        private List<WeaponSkinLevelDTO> levels;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponSkinChromaDTO {
        private String uuid;
        private String displayName;
        private String displayIcon;
        private String fullRender;
        private Object swatch;
        private String assetPath;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class WeaponSkinLevelDTO {
        private String uuid;
        private String displayName;
        private Object levelItem;
        private String displayIcon;
        private String assetPath;
    }
}

