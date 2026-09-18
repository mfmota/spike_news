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
@Table(name = "valorant_maps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class ValorantMap {

    @Id
    @Column(name = "uuid", length = 64)
    @EqualsAndHashCode.Include
    private String uuid;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "coordinates")
    private String coordinates;

    @Column(name = "display_icon")
    private String displayIcon;

    @Column(name = "list_view_icon")
    private String listViewIcon;

    @Column(name = "splash")
    private String splash;

    @Column(name = "map_url")
    private String mapUrl;

    @Column(name = "x_multiplier")
    private Double xMultiplier;

    @Column(name = "y_multiplier")
    private Double yMultiplier;

    @Column(name = "x_scalar_to_add")
    private Double xScalarToAdd;

    @Column(name = "y_scalar_to_add")
    private Double yScalarToAdd;

    @Column(name = "last_sync")
    private LocalDateTime lastSync;
}

