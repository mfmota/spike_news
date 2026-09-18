package com.example.spikenews.controller;

import com.example.spikenews.dto.auth.CreateJournalistRequestDTO;
import com.example.spikenews.dto.auth.UserResponseDTO;
import com.example.spikenews.model.enums.Role;
import com.example.spikenews.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AuthService authService;

    public AdminUserController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/journalists")
    public ResponseEntity<UserResponseDTO> createJournalist(@Valid @RequestBody CreateJournalistRequestDTO request) {
        UserResponseDTO response = authService.registerJournalist(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<UserResponseDTO> updateRole(@PathVariable Long id, @RequestParam Role role) {
        UserResponseDTO response = authService.updateUserRole(id, role);
        return ResponseEntity.ok(response);
    }
}

