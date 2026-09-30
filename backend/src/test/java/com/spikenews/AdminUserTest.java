package com.spikenews;

import com.spikenews.dto.AdminCreateUserDTO;
import com.spikenews.dto.AdminUpdateUserDTO;
import com.spikenews.dto.UserResponseDTO;
import com.spikenews.model.Role;
import com.spikenews.model.User;
import com.spikenews.repository.UserRepository;
import com.spikenews.service.AdminUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
@Transactional
public class AdminUserTest {

    @Autowired
    private AdminUserService adminUserService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    private User testAdmin;
    private User testUser;

    @BeforeEach
    void setUp() {
        if (!userRepository.existsByEmail("admin_test@spikenews.gg")) {
            testAdmin = userRepository.save(new User(
                    "Admin Master",
                    "admin_test@spikenews.gg",
                    passwordEncoder.encode("admin123"),
                    Role.ADMIN
            ));
        } else {
            testAdmin = userRepository.findByEmail("admin_test@spikenews.gg").orElseThrow();
        }

        if (!userRepository.existsByEmail("user_test@spikenews.gg")) {
            testUser = userRepository.save(new User(
                    "User Test",
                    "user_test@spikenews.gg",
                    passwordEncoder.encode("user123"),
                    Role.USER
            ));
        } else {
            testUser = userRepository.findByEmail("user_test@spikenews.gg").orElseThrow();
        }
    }

    @Test
    @DisplayName("Admin deve conseguir listar todos os usuários cadastrados")
    void shouldListAllUsers() {
        List<UserResponseDTO> users = adminUserService.getAllUsers();
        assertNotNull(users);
        assertTrue(users.size() >= 2);
    }

    @Test
    @DisplayName("Admin deve conseguir criar um novo usuário com role JORNALISTA")
    void shouldCreateNewUser() {
        AdminCreateUserDTO dto = new AdminCreateUserDTO(
                "Novo Redator",
                "redator_novo@spikenews.gg",
                "senha123",
                Role.JORNALISTA
        );

        UserResponseDTO created = adminUserService.createUser(dto);
        assertNotNull(created.getId());
        assertEquals("Novo Redator", created.getNome());
        assertEquals("redator_novo@spikenews.gg", created.getEmail());
        assertEquals(Role.JORNALISTA, created.getRole());

        User inDb = userRepository.findById(created.getId()).orElse(null);
        assertNotNull(inDb);
        assertTrue(passwordEncoder.matches("senha123", inDb.getSenhaHash()));
    }

    @Test
    @DisplayName("Não deve permitir cadastrar usuário com email duplicado")
    void shouldNotAllowDuplicateEmail() {
        AdminCreateUserDTO dto = new AdminCreateUserDTO(
                "Duplicado",
                "admin_test@spikenews.gg",
                "senha123",
                Role.USER
        );

        assertThrows(IllegalArgumentException.class, () -> {
            adminUserService.createUser(dto);
        });
    }

    @Test
    @DisplayName("Admin deve conseguir atualizar o perfil e dados do usuário")
    void shouldUpdateUser() {
        AdminUpdateUserDTO dto = new AdminUpdateUserDTO(
                "User Test Renomeado",
                "user_test_updated@spikenews.gg",
                "novaSenha456",
                Role.JORNALISTA
        );

        UserResponseDTO updated = adminUserService.updateUser(testUser.getId(), dto);
        assertEquals("User Test Renomeado", updated.getNome());
        assertEquals("user_test_updated@spikenews.gg", updated.getEmail());
        assertEquals(Role.JORNALISTA, updated.getRole());

        User inDb = userRepository.findById(testUser.getId()).orElse(null);
        assertNotNull(inDb);
        assertTrue(passwordEncoder.matches("novaSenha456", inDb.getSenhaHash()));
    }

    @Test
    @DisplayName("Admin deve conseguir excluir outro usuário mas não sua própria conta")
    void shouldDeleteOtherUserAndPreventSelfDelete() {
        // Criar usuário para exclusão
        User tempUser = userRepository.save(new User(
                "Para Excluir",
                "delete_me@spikenews.gg",
                passwordEncoder.encode("senha123"),
                Role.USER
        ));

        // Testar auto-exclusão (deve falhar)
        assertThrows(IllegalArgumentException.class, () -> {
            adminUserService.deleteUser(testAdmin.getId(), testAdmin.getEmail());
        });

        // Testar exclusão válida de outro usuário
        adminUserService.deleteUser(tempUser.getId(), testAdmin.getEmail());
        assertFalse(userRepository.findById(tempUser.getId()).isPresent());
    }
}
