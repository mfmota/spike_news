package com.spikenews.dto;

import com.spikenews.model.Match;
import com.spikenews.model.MatchStatus;

import java.time.LocalDateTime;

public class MatchResponseDTO {

    private Long idPartida;
    private Long idTimeCasa;
    private String timeCasa;
    private String logoTimeCasa;
    private Long idTimeFora;
    private String timeFora;
    private String logoTimeFora;
    private Integer pontuacaoCasa;
    private Integer pontuacaoFora;
    private MatchStatus status;
    private String evento;
    private LocalDateTime dataPartida;
    private LocalDateTime updatedAt;

    public MatchResponseDTO() {}

    public MatchResponseDTO(Match match) {
        this.idPartida = match.getId();
        this.idTimeCasa = match.getTimeCasa() != null ? match.getTimeCasa().getId() : null;
        this.timeCasa = match.getTimeCasa() != null ? match.getTimeCasa().getNome() : "";
        this.logoTimeCasa = match.getTimeCasa() != null ? match.getTimeCasa().getUrlLogo() : "";
        this.idTimeFora = match.getTimeFora() != null ? match.getTimeFora().getId() : null;
        this.timeFora = match.getTimeFora() != null ? match.getTimeFora().getNome() : "";
        this.logoTimeFora = match.getTimeFora() != null ? match.getTimeFora().getUrlLogo() : "";
        this.pontuacaoCasa = match.getPontuacaoCasa();
        this.pontuacaoFora = match.getPontuacaoFora();
        this.status = match.getStatus();
        this.evento = match.getEvento();
        this.dataPartida = match.getDataPartida();
        this.updatedAt = match.getUpdatedAt();
    }

    public Long getIdPartida() {
        return idPartida;
    }

    public void setIdPartida(Long idPartida) {
        this.idPartida = idPartida;
    }

    public Long getIdTimeCasa() {
        return idTimeCasa;
    }

    public void setIdTimeCasa(Long idTimeCasa) {
        this.idTimeCasa = idTimeCasa;
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

    public Long getIdTimeFora() {
        return idTimeFora;
    }

    public void setIdTimeFora(Long idTimeFora) {
        this.idTimeFora = idTimeFora;
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

    public LocalDateTime getDataPartida() {
        return dataPartida;
    }

    public void setDataPartida(LocalDateTime dataPartida) {
        this.dataPartida = dataPartida;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
