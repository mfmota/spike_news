package com.spikenews.dto;

import com.spikenews.model.News;

import java.time.LocalDateTime;

public class NewsResponseDTO {

    private Long id;
    private String titulo;
    private String conteudo;
    private LocalDateTime dataPublicacao;
    private Long autorId;
    private String autorNome;
    private Long timeId;
    private String timeNome;
    private String timeLogo;

    public NewsResponseDTO() {}

    public NewsResponseDTO(News news) {
        this.id = news.getId();
        this.titulo = news.getTitulo();
        this.conteudo = news.getConteudo();
        this.dataPublicacao = news.getDataPublicacao();
        this.autorId = news.getAutor() != null ? news.getAutor().getId() : null;
        this.autorNome = news.getAutor() != null ? news.getAutor().getNome() : "";
        this.timeId = news.getTimeRelacionado() != null ? news.getTimeRelacionado().getId() : null;
        this.timeNome = news.getTimeRelacionado() != null ? news.getTimeRelacionado().getNome() : null;
        this.timeLogo = news.getTimeRelacionado() != null ? news.getTimeRelacionado().getUrlLogo() : null;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public LocalDateTime getDataPublicacao() {
        return dataPublicacao;
    }

    public void setDataPublicacao(LocalDateTime dataPublicacao) {
        this.dataPublicacao = dataPublicacao;
    }

    public Long getAutorId() {
        return autorId;
    }

    public void setAutorId(Long autorId) {
        this.autorId = autorId;
    }

    public String getAutorNome() {
        return autorNome;
    }

    public void setAutorNome(String autorNome) {
        this.autorNome = autorNome;
    }

    public Long getTimeId() {
        return timeId;
    }

    public void setTimeId(Long timeId) {
        this.timeId = timeId;
    }

    public String getTimeNome() {
        return timeNome;
    }

    public void setTimeNome(String timeNome) {
        this.timeNome = timeNome;
    }

    public String getTimeLogo() {
        return timeLogo;
    }

    public void setTimeLogo(String timeLogo) {
        this.timeLogo = timeLogo;
    }
}
