package com.example.spikenews.controller;

import com.example.spikenews.model.ValorantAgent;
import com.example.spikenews.model.ValorantMap;
import com.example.spikenews.service.ValorantCatalogService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    private final ValorantCatalogService catalogService;

    public CatalogController(ValorantCatalogService catalogService) {
        this.catalogService = catalogService;
    }

    @GetMapping("/agents")
    public ResponseEntity<List<ValorantAgent>> getAgents() {
        List<ValorantAgent> agents = catalogService.getAllAgents();
        return ResponseEntity.ok(agents);
    }

    @GetMapping("/agents/{uuid}")
    public ResponseEntity<ValorantAgent> getAgentByUuid(@PathVariable String uuid) {
        ValorantAgent agent = catalogService.getAgentByUuid(uuid);
        return ResponseEntity.ok(agent);
    }

    @GetMapping("/maps")
    public ResponseEntity<List<ValorantMap>> getMaps() {
        List<ValorantMap> maps = catalogService.getAllMaps();
        return ResponseEntity.ok(maps);
    }

    @GetMapping("/maps/{uuid}")
    public ResponseEntity<ValorantMap> getMapByUuid(@PathVariable String uuid) {
        ValorantMap map = catalogService.getMapByUuid(uuid);
        return ResponseEntity.ok(map);
    }

    @PostMapping("/sync")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> manualSync() {
        catalogService.syncCatalog();
        return ResponseEntity.ok(Map.of(
                "message", "Catálogo sincronizado com sucesso a partir da API pública do Valorant.",
                "totalAgentes", catalogService.getAgentsCount(),
                "totalMapas", catalogService.getMapsCount()
        ));
    }
}

