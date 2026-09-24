package com.spikenews.controller;

import com.spikenews.model.AgentCatalog;
import com.spikenews.model.MapCatalog;
import com.spikenews.model.WeaponCatalog;
import com.spikenews.service.CatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/agents")
    public ResponseEntity<List<AgentCatalog>> getAgents() {
        return ResponseEntity.ok(catalogService.getAllAgents());
    }

    @GetMapping("/maps")
    public ResponseEntity<List<MapCatalog>> getMaps() {
        return ResponseEntity.ok(catalogService.getAllMaps());
    }

    @GetMapping("/weapons")
    public ResponseEntity<List<WeaponCatalog>> getWeapons() {
        return ResponseEntity.ok(catalogService.getAllWeapons());
    }

    @PostMapping("/sync")
    public ResponseEntity<String> forceSync() {
        catalogService.syncCatalog();
        return ResponseEntity.ok("Sincronização de catálogo acionada com sucesso.");
    }
}
