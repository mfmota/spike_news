package com.spikenews.dto;

import com.spikenews.model.MatchStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class MatchUpdateDTO {

    private Long idPartida;

    @NotBlank(message = "Nome do time da casa é obrigatório")
    private String timeCasa;

    private String logoTimeCasa;

    @NotBlank(message = "Nome do time de fora é obrigatório")
    private String timeFora;

    private String logoTimeFora;

    @NotNull(message = "Pontuação do time da casa é obrigatória")
    private Integer pontuacaoCasa = 0;

    @NotNull(message = "Pontuação do time de fora é obrigatória")
    private Integer pontuacaoFora = 0;

    private MatchStatus status = MatchStatus.AO_VIVO;

    private String evento;

    public MatchUpdateDTO() {}

    public MatchUpdateDTO(String timeCasa, String logoTimeCasa, String timeFora, String logoTimeFora, Integer pontuacaoCasa, Integer pontuacaoFora, MatchStatus status, String evento) {
        this.timeCasa = timeCasa;
        this.logoTimeCasa = logoTimeCasa;
        this.timeFora = timeFora;
        this.logoTimeFora = logoTimeFora;
        this.pontuacaoCasa = pontuacaoCasa;
        this.pontuacaoFora = pontuacaoFora;
        this.status = status;
        this.evento = evento;
    }

    public Long getIdPartida() {
        return idPartida;
    }

    public void setIdPartida(Long idPartida) {
        this.idPartida = idPartida;
    }

    public String getTimeCasa() {
        return timeCasa;
    }

    public void setTimeCasa(String timeCasa) {
        this.timeCasa = timeCasa;
    }

    public String getLogoTimeCasa() {
        return logoTimeCasa;
    }

    public void setLogoTimeCasa(String logoTimeCasa) {
        this.logoTimeCasa = logoTimeCasa;
    }

    public String getTimeFora() {
        return timeFora;
    }

    public void setTimeFora(String timeFora) {
        this.timeFora = timeFora;
    }

    public String getLogoTimeFora() {
        return logoTimeFora;
    }

    public void setLogoTimeFora(String logoTimeFora) {
        this.logoTimeFora = logoTimeFora;
    }

    public Integer getPontuacaoCasa() {
        return pontuacaoCasa;
    }

    public void setPontuacaoCasa(Integer pontuacaoCasa) {
        this.pontuacaoCasa = pontuacaoCasa;
    }

    public Integer getPontuacaoFora() {
        return pontuacaoFora;
    }

    public void setPontuacaoFora(Integer pontuacaoFora) {
        this.pontuacaoFora = pontuacaoFora;
    }

    public MatchStatus getStatus() {
        return status;
    }

    public void setStatus(MatchStatus status) {
        this.status = status;
    }

    public String getEvento() {
        return evento;
    }

    public void setEvento(String evento) {
        this.evento = evento;
    }
}
