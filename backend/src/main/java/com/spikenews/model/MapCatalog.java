package com.spikenews.model;

import jakarta.persistence.*;

@Entity
@Table(name = "catalog_maps")
public class MapCatalog {

    @Id
    private String uuid;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "coordinates")
    private String coordinates;

    @Column(name = "display_icon")
    private String displayIcon;

    @Column(name = "splash")
    private String splash;

    public MapCatalog() {}

    public MapCatalog(String uuid, String displayName, String coordinates, String displayIcon, String splash) {
        this.uuid = uuid;
        this.displayName = displayName;
        this.coordinates = coordinates;
        this.displayIcon = displayIcon;
        this.splash = splash;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getCoordinates() {
        return coordinates;
    }

    public void setCoordinates(String coordinates) {
        this.coordinates = coordinates;
    }

    public String getDisplayIcon() {
        return displayIcon;
    }

    public void setDisplayIcon(String displayIcon) {
        this.displayIcon = displayIcon;
    }

    public String getSplash() {
        return splash;
    }

    public void setSplash(String splash) {
        this.splash = splash;
    }
}
