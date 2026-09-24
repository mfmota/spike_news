package com.spikenews.model;

import jakarta.persistence.*;

@Entity
@Table(name = "teams")
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_time")
    private Long id;

    @Column(name = "id_api_externa")
    private String idApiExterna;

    @Column(name = "nome", nullable = false, unique = true)
    private String nome;

    @Column(name = "url_logo")
    private String urlLogo;

    public Team() {}

    public Team(String nome, String urlLogo, String idApiExterna) {
        this.nome = nome;
        this.urlLogo = urlLogo;
        this.idApiExterna = idApiExterna;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getIdApiExterna() {
        return idApiExterna;
    }

    public void setIdApiExterna(String idApiExterna) {
        this.idApiExterna = idApiExterna;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getUrlLogo() {
        return urlLogo;
    }

    public void setUrlLogo(String urlLogo) {
        this.urlLogo = urlLogo;
    }
}
