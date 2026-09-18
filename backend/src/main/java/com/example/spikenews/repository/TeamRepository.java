package com.example.spikenews.repository;

import com.example.spikenews.model.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, Long> {

    Optional<Team> findByIdApiExterna(String idApiExterna);

    Optional<Team> findByNome(String nome);

    List<Team> findByNomeContainingIgnoreCase(String nome);
}

