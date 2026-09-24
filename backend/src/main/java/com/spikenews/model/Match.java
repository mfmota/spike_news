package com.spikenews.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida")
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_time_casa", nullable = false)
    private Team timeCasa;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_time_fora", nullable = false)
    private Team timeFora;

    @Column(name = "pontuacao_casa", nullable = false)
    private Integer pontuacaoCasa = 0;

    @Column(name = "pontuacao_fora", nullable = false)
    private Integer pontuacaoFora = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private MatchStatus status = MatchStatus.AGENDADO;

    @Column(name = "evento")
    private String evento;

    @Column(name = "data_partida")
    private LocalDateTime dataPartida;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Match() {}

    public Match(Team timeCasa, Team timeFora, Integer pontuacaoCasa, Integer pontuacaoFora, MatchStatus status, String evento, LocalDateTime dataPartida) {
        this.timeCasa = timeCasa;
        this.timeFora = timeFora;
        this.pontuacaoCasa = pontuacaoCasa;
        this.pontuacaoFora = pontuacaoFora;
        this.status = status;
        this.evento = evento;
        this.dataPartida = dataPartida;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Team getTimeCasa() {
        return timeCasa;
    }

    public void setTimeCasa(Team timeCasa) {
        this.timeCasa = timeCasa;
    }

    public Team getTimeFora() {
        return timeFora;
    }

    public void setTimeFora(Team timeFora) {
        this.timeFora = timeFora;
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
