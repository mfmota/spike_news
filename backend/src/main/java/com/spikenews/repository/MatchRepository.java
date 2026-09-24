package com.spikenews.repository;

import com.spikenews.model.Match;
import com.spikenews.model.MatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    List<Match> findByStatusOrderByDataPartidaDesc(MatchStatus status);
    List<Match> findByTimeCasaIdOrTimeForaId(Long timeCasaId, Long timeForaId);
}
