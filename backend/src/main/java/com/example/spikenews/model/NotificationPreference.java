package com.example.spikenews.model;

import com.example.spikenews.model.enums.NotificationType;
import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MapsId;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Table(name = "notification_preferences")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"usuario", "time"})
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
public class NotificationPreference {

    @EmbeddedId
    @Builder.Default
    @EqualsAndHashCode.Include
    private NotificationPreferenceId id = new NotificationPreferenceId();

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("usuarioId")
    @JoinColumn(name = "fk_usuario_id", nullable = false)
    private User usuario;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @MapsId("timeId")
    @JoinColumn(name = "fk_time_id", nullable = false)
    private Team time;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_alerta", nullable = false, length = 20)
    private NotificationType tipoAlerta;

    public NotificationPreference(User usuario, Team time, NotificationType tipoAlerta) {
        this.usuario = usuario;
        this.time = time;
        this.tipoAlerta = tipoAlerta;
        this.id = new NotificationPreferenceId(
            usuario != null ? usuario.getId() : null,
            time != null ? time.getId() : null
        );
    }
}

