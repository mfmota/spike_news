package com.example.spikenews.repository;

import com.example.spikenews.model.Match;
import com.example.spikenews.model.enums.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {

    Optional<Match> findByIdApiExterna(String idApiExterna);

    List<Match> findByStatus(MatchStatus status);

    @Query("SELECT m FROM Match m WHERE m.timeCasa.id = :teamId OR m.timeFora.id = :teamId")
    List<Match> findByTeamId(@Param("teamId") Long teamId);

    List<Match> findByTimeCasaIdOrTimeForaId(Long timeCasaId, Long timeForaId);
}
