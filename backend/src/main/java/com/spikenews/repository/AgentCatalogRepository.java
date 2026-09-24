package com.spikenews.repository;

import com.spikenews.model.AgentCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AgentCatalogRepository extends JpaRepository<AgentCatalog, String> {
}
