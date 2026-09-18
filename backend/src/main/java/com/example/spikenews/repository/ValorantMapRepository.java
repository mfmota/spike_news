package com.example.spikenews.repository;

import com.example.spikenews.model.ValorantMap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ValorantMapRepository extends JpaRepository<ValorantMap, String> {

    Optional<ValorantMap> findByDisplayNameIgnoreCase(String displayName);

    List<ValorantMap> findByDisplayNameContainingIgnoreCase(String displayName);
}

