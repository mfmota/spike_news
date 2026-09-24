package com.spikenews.model;

import jakarta.persistence.*;

@Entity
@Table(name = "notification_preferences", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"fk_usuario_id", "fk_time_id"})
})
public class NotificationPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "fk_time_id", nullable = false)
    private Team time;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alerta", nullable = false)
    private AlertType tipoAlerta;

    public NotificationPreference() {}

    public NotificationPreference(User usuario, Team time, AlertType tipoAlerta) {
        this.usuario = usuario;
        this.time = time;
        this.tipoAlerta = tipoAlerta;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUsuario() {
        return usuario;
    }

    public void setUsuario(User usuario) {
        this.usuario = usuario;
    }

    public Team getTime() {
        return time;
    }

    public void setTime(Team time) {
        this.time = time;
    }

    public AlertType getTipoAlerta() {
        return tipoAlerta;
    }

    public void setTipoAlerta(AlertType tipoAlerta) {
        this.tipoAlerta = tipoAlerta;
    }
}
