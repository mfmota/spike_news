package com.spikenews.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class NewsRequestDTO {

    @NotBlank(message = "O título é obrigatório")
    @Size(min = 5, max = 255, message = "O título deve ter entre 5 e 255 caracteres")
    private String titulo;

    @NotBlank(message = "O conteúdo é obrigatório")
    private String conteudo;

    private Long teamId;

    public NewsRequestDTO() {}

    public NewsRequestDTO(String titulo, String conteudo, Long teamId) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.teamId = teamId;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public String getConteudo() {
        return conteudo;
    }

    public void setConteudo(String conteudo) {
        this.conteudo = conteudo;
    }

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }
}
