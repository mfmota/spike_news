package com.spikenews.model;

import jakarta.persistence.*;

@Entity
@Table(name = "catalog_weapons")
public class WeaponCatalog {

    @Id
    private String uuid;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "category")
    private String category;

    @Column(name = "display_icon")
    private String displayIcon;

    @Column(name = "cost")
    private Integer cost;

    @Column(name = "magazine_size")
    private Integer magazineSize;

    @Column(name = "fire_rate")
    private Float fireRate;

    public WeaponCatalog() {}

    public WeaponCatalog(String uuid, String displayName, String category, String displayIcon, Integer cost, Integer magazineSize, Float fireRate) {
        this.uuid = uuid;
        this.displayName = displayName;
        this.category = category;
        this.displayIcon = displayIcon;
        this.cost = cost;
        this.magazineSize = magazineSize;
        this.fireRate = fireRate;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getDisplayIcon() {
        return displayIcon;
    }

    public void setDisplayIcon(String displayIcon) {
        this.displayIcon = displayIcon;
    }

    public Integer getCost() {
        return cost;
    }

    public void setCost(Integer cost) {
        this.cost = cost;
    }

    public Integer getMagazineSize() {
        return magazineSize;
    }

    public void setMagazineSize(Integer magazineSize) {
        this.magazineSize = magazineSize;
    }

    public Float getFireRate() {
        return fireRate;
    }

    public void setFireRate(Float fireRate) {
        this.fireRate = fireRate;
    }
}
