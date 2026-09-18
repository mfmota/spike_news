package com.example.spikenews.model;

import com.example.spikenews.model.enums.MatchStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"timeCasa", "timeFora"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_partida")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "id_api_externa", unique = true)
    private String idApiExterna;

    @Column(name = "url_match")
    private String urlMatch;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk_time_casa", nullable = false)
    private Team timeCasa;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "fk_time_fora", nullable = false)
    private Team timeFora;

    @Column(name = "pontuacao_casa")
    private Integer pontuacaoCasa;

    @Column(name = "pontuacao_fora")
    private Integer pontuacaoFora;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private MatchStatus status;

    @Column(name = "torneio")
    private String torneio;

    @Column(name = "fase_torneio")
    private String faseTorneio;

    @Column(name = "tempo_status")
    private String tempoStatus;
}
