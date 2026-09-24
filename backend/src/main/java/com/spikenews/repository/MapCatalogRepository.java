package com.spikenews.repository;

import com.spikenews.model.MapCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MapCatalogRepository extends JpaRepository<MapCatalog, String> {
}
