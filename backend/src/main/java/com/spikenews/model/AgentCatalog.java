package com.spikenews.model;

import jakarta.persistence.*;

@Entity
@Table(name = "catalog_agents")
public class AgentCatalog {

    @Id
    private String uuid;

    @Column(name = "display_name", nullable = false)
    private String displayName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "developer_name")
    private String developerName;

    @Column(name = "display_icon")
    private String displayIcon;

    @Column(name = "full_portrait")
    private String fullPortrait;

    @Column(name = "role_name")
    private String roleName;

    @Column(name = "role_icon")
    private String roleIcon;

    public AgentCatalog() {}

    public AgentCatalog(String uuid, String displayName, String description, String developerName, String displayIcon, String fullPortrait, String roleName, String roleIcon) {
        this.uuid = uuid;
        this.displayName = displayName;
        this.description = description;
        this.developerName = developerName;
        this.displayIcon = displayIcon;
        this.fullPortrait = fullPortrait;
        this.roleName = roleName;
        this.roleIcon = roleIcon;
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDeveloperName() {
        return developerName;
    }

    public void setDeveloperName(String developerName) {
        this.developerName = developerName;
    }

    public String getDisplayIcon() {
        return displayIcon;
    }

    public void setDisplayIcon(String displayIcon) {
        this.displayIcon = displayIcon;
    }

    public String getFullPortrait() {
        return fullPortrait;
    }

    public void setFullPortrait(String fullPortrait) {
        this.fullPortrait = fullPortrait;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleIcon() {
        return roleIcon;
    }

    public void setRoleIcon(String roleIcon) {
        this.roleIcon = roleIcon;
    }
}
