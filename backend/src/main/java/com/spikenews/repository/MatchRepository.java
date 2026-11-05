package com.spikenews.repository;

import com.spikenews.model.Match;
import com.spikenews.model.MatchStatus;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MatchRepository extends JpaRepository<Match, Long> {
    Optional<Match> findByIdExterno(String idExterno);

    List<Match> findByStatus(MatchStatus status, Pageable pageable);

    List<Match> findByStatusIn(List<MatchStatus> statuses, Pageable pageable);

    List<Match> findByTimeCasaIdOrTimeForaId(Long timeCasaId, Long timeForaId);
}
