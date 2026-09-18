package com.example.spikenews.repository;

import com.example.spikenews.model.ValorantAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ValorantAgentRepository extends JpaRepository<ValorantAgent, String> {

    List<ValorantAgent> findByIsPlayableCharacterTrue();

    List<ValorantAgent> findByRoleDisplayNameIgnoreCase(String roleDisplayName);

    List<ValorantAgent> findByDisplayNameContainingIgnoreCase(String displayName);
}

