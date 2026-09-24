package com.spikenews.dto;

import com.spikenews.model.AlertType;
import jakarta.validation.constraints.NotNull;

public class PreferenceDTO {

    private Long id;

    @NotNull(message = "ID do time é obrigatório")
    private Long teamId;

    private String teamName;
    private String teamLogo;

    @NotNull(message = "Tipo de alerta é obrigatório (JOGOS, NOTICIAS, AMBOS)")
    private AlertType tipoAlerta;

    public PreferenceDTO() {}

    public PreferenceDTO(Long id, Long teamId, String teamName, String teamLogo, AlertType tipoAlerta) {
        this.id = id;
        this.teamId = teamId;
        this.teamName = teamName;
        this.teamLogo = teamLogo;
        this.tipoAlerta = tipoAlerta;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public String getTeamLogo() {
        return teamLogo;
    }

    public void setTeamLogo(String teamLogo) {
        this.teamLogo = teamLogo;
    }

    public AlertType getTipoAlerta() {
        return tipoAlerta;
    }

    public void setTipoAlerta(AlertType tipoAlerta) {
        this.tipoAlerta = tipoAlerta;
    }
}
