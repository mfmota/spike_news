package com.example.spikenews.dto.auth;

import com.example.spikenews.model.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResponseDTO {

    private String token;

    @Builder.Default
    private String tipo = "Bearer";

    private Long idUsuario;
    private String nome;
    private String email;
    private Role role;
}

