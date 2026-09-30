package com.spikenews.service;

import com.spikenews.dto.AdminCreateUserDTO;
import com.spikenews.dto.AdminUpdateUserDTO;
import com.spikenews.dto.UserResponseDTO;
import com.spikenews.model.News;
import com.spikenews.model.NotificationPreference;
import com.spikenews.model.Role;
import com.spikenews.model.User;
import com.spikenews.repository.NewsRepository;
import com.spikenews.repository.NotificationPreferenceRepository;
import com.spikenews.repository.UserRepository;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    private final UserRepository userRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final NewsRepository newsRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserService(
            UserRepository userRepository,
            NotificationPreferenceRepository preferenceRepository,
            NewsRepository newsRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.preferenceRepository = preferenceRepository;
        this.newsRepository = newsRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional(readOnly = true)
    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll(Sort.by(Sort.Direction.ASC, "id"))
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponseDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + id));
        return new UserResponseDTO(user);
    }

    @Transactional
    public UserResponseDTO createUser(AdminCreateUserDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new IllegalArgumentException("O email '" + dto.getEmail() + "' já está cadastrado.");
        }

        User user = new User(
                dto.getNome().trim(),
                dto.getEmail().trim().toLowerCase(),
                passwordEncoder.encode(dto.getSenha()),
                dto.getRole()
        );

        User saved = userRepository.save(user);
        return new UserResponseDTO(saved);
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, AdminUpdateUserDTO dto) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + id));

        String newEmail = dto.getEmail().trim().toLowerCase();
        if (!user.getEmail().equalsIgnoreCase(newEmail) && userRepository.existsByEmail(newEmail)) {
            throw new IllegalArgumentException("O email '" + newEmail + "' já está em uso por outro usuário.");
        }

        user.setNome(dto.getNome().trim());
        user.setEmail(newEmail);
        user.setRole(dto.getRole());

        if (dto.getSenha() != null && !dto.getSenha().trim().isEmpty()) {
            if (dto.getSenha().trim().length() < 6) {
                throw new IllegalArgumentException("A nova senha deve ter no mínimo 6 caracteres.");
            }
            user.setSenhaHash(passwordEncoder.encode(dto.getSenha().trim()));
        }

        User updated = userRepository.save(user);
        return new UserResponseDTO(updated);
    }

    @Transactional
    public void deleteUser(Long id, String currentAdminEmail) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Usuário não encontrado com ID: " + id));

        if (user.getEmail().equalsIgnoreCase(currentAdminEmail)) {
            throw new IllegalArgumentException("Você não pode excluir a sua própria conta de administrador em uso.");
        }

        // If deleting a user, remove their notification preferences
        List<NotificationPreference> preferences = preferenceRepository.findByUsuarioId(id);
        if (!preferences.isEmpty()) {
            preferenceRepository.deleteAll(preferences);
        }

        // If user is a journalist with authored news, reassign news to the admin acting or clean up
        List<News> authoredNews = newsRepository.findByAutorId(id);
        if (!authoredNews.isEmpty()) {
            User admin = userRepository.findByEmail(currentAdminEmail)
                    .orElse(null);
            if (admin != null) {
                for (News news : authoredNews) {
                    news.setAutor(admin);
                }
                newsRepository.saveAll(authoredNews);
            }
        }

        userRepository.delete(user);
    }
}
