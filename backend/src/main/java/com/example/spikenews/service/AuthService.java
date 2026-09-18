package com.example.spikenews.service;

import com.example.spikenews.dto.auth.AuthResponseDTO;
import com.example.spikenews.dto.auth.CreateJournalistRequestDTO;
import com.example.spikenews.dto.auth.LoginRequestDTO;
import com.example.spikenews.dto.auth.RegisterRequestDTO;
import com.example.spikenews.dto.auth.UserResponseDTO;
import com.example.spikenews.exception.ResourceNotFoundException;
import com.example.spikenews.exception.UserAlreadyExistsException;
import com.example.spikenews.model.User;
import com.example.spikenews.model.enums.Role;
import com.example.spikenews.repository.UserRepository;
import com.example.spikenews.security.TokenService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       AuthenticationManager authenticationManager,
                       TokenService tokenService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        var authToken = new UsernamePasswordAuthenticationToken(dto.getEmail(), dto.getSenha());
        var authentication = authenticationManager.authenticate(authToken);
        var user = (User) authentication.getPrincipal();

        String token = tokenService.generateToken(user);

        return AuthResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .idUsuario(user.getId())
                .nome(user.getNome())
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    @Transactional
    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException("Já existe um usuário cadastrado com o e-mail: " + dto.getEmail());
        }

        User user = User.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senhaHash(passwordEncoder.encode(dto.getSenha()))
                .role(Role.USER)
                .build();

        User savedUser = userRepository.save(user);
        String token = tokenService.generateToken(savedUser);

        return AuthResponseDTO.builder()
                .token(token)
                .tipo("Bearer")
                .idUsuario(savedUser.getId())
                .nome(savedUser.getNome())
                .email(savedUser.getEmail())
                .role(savedUser.getRole())
                .build();
    }

    @Transactional
    public UserResponseDTO registerJournalist(CreateJournalistRequestDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new UserAlreadyExistsException("Já existe um usuário cadastrado com o e-mail: " + dto.getEmail());
        }

        User journalist = User.builder()
                .nome(dto.getNome())
                .email(dto.getEmail())
                .senhaHash(passwordEncoder.encode(dto.getSenha()))
                .role(Role.JORNALISTA)
                .build();

        User savedJournalist = userRepository.save(journalist);
        return UserResponseDTO.fromEntity(savedJournalist);
    }

    @Transactional
    public UserResponseDTO updateUserRole(Long userId, Role newRole) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado com id: " + userId));

        user.setRole(newRole);
        User updated = userRepository.save(user);
        return UserResponseDTO.fromEntity(updated);
    }
}

