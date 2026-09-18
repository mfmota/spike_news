package com.example.spikenews.repository;

import com.example.spikenews.model.NotificationPreference;
import com.example.spikenews.model.NotificationPreferenceId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<NotificationPreference, NotificationPreferenceId> {

    List<NotificationPreference> findByUsuarioId(Long usuarioId);

    List<NotificationPreference> findByTimeId(Long timeId);

    Optional<NotificationPreference> findByUsuarioIdAndTimeId(Long usuarioId, Long timeId);

    void deleteByUsuarioIdAndTimeId(Long usuarioId, Long timeId);
}

