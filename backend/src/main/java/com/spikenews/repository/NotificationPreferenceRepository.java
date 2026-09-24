package com.spikenews.repository;

import com.spikenews.model.NotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, Long> {
    List<NotificationPreference> findByUsuarioId(Long usuarioId);
    List<NotificationPreference> findByTimeId(Long timeId);
    Optional<NotificationPreference> findByUsuarioIdAndTimeId(Long usuarioId, Long timeId);
}
