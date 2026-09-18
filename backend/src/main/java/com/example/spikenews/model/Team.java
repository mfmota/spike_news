package com.example.spikenews.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "teams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"noticias", "preferenciasNotificacao", "partidasCasa", "partidasFora"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_time")
    @EqualsAndHashCode.Include
    private Long id;

    @Column(name = "id_api_externa")
    private String idApiExterna;

    @Column(name = "nome", nullable = false)
    private String nome;

    @Column(name = "url_logo")
    private String urlLogo;

    @Builder.Default
    @OneToMany(mappedBy = "timeRelacionado")
    private List<News> noticias = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "time", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NotificationPreference> preferenciasNotificacao = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "timeCasa")
    private List<Match> partidasCasa = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "timeFora")
    private List<Match> partidasFora = new ArrayList<>();
}

