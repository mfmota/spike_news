package com.spikenews.repository;

import com.spikenews.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {
    Optional<Team> findByNomeIgnoreCase(String nome);
    Optional<Team> findByIdApiExterna(String idApiExterna);
}
