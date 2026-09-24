package com.spikenews.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "news")
public class News {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_noticia")
    private Long id;

    @Column(name = "titulo", nullable = false)
    private String titulo;

    @Column(name = "conteudo", nullable = false, columnDefinition = "TEXT")
    private String conteudo;

    @Column(name = "data_publicacao", nullable = false)
    private LocalDateTime dataPublicacao = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_autor_id", nullable = false)
    private User autor;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_time_relacionado")
    private Team timeRelacionado;

    public News() {}

    public News(String titulo, String conteudo, User autor, Team timeRelacionado) {
        this.titulo = titulo;
        this.conteudo = conteudo;
        this.autor = autor;
        this.timeRelacionado = timeRelacionado;
        this.dataPublicacao = LocalDateTime.now();
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

    public User getAutor() {
        return autor;
    }

    public void setAutor(User autor) {
        this.autor = autor;
    }

    public Team getTimeRelacionado() {
        return timeRelacionado;
    }

    public void setTimeRelacionado(Team timeRelacionado) {
        this.timeRelacionado = timeRelacionado;
    }
}
