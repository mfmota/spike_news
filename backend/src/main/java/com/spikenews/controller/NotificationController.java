package com.spikenews.controller;

import com.spikenews.dto.PreferenceDTO;
import com.spikenews.service.NotificationService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/preferences")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping
    public ResponseEntity<List<PreferenceDTO>> getPreferences(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(notificationService.getUserPreferences(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<PreferenceDTO> savePreference(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody PreferenceDTO dto) {
        PreferenceDTO saved = notificationService.savePreference(
                userDetails.getUsername(),
                dto.getTeamId(),
                dto.getTipoAlerta()
        );
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<Void> deletePreference(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long teamId) {
        notificationService.deletePreference(userDetails.getUsername(), teamId);
        return ResponseEntity.noContent().build();
    }
}
