package com.spikenews.repository;

import com.spikenews.model.WeaponCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WeaponCatalogRepository extends JpaRepository<WeaponCatalog, String> {
}
