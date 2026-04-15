package com.knight.scizzor.controller;

import com.knight.scizzor.dto.ProfileResponseDto;
import com.knight.scizzor.dto.ProfileUpdateDto;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.repository.EstablishmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
public class EstablishmentController {

    @Autowired
    private EstablishmentRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<ProfileResponseDto> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Establishment est = repository.findByEmail(email).orElseThrow();
        return ResponseEntity.ok(new ProfileResponseDto(est.getName(), est.getUsername(), est.getEmail()));
    }

    @PutMapping
    public ResponseEntity<?> updateProfile(@RequestBody ProfileUpdateDto updateDto, Authentication authentication) {
        String currentEmail = authentication.getName();
        Establishment est = repository.findByEmail(currentEmail).orElseThrow();

        // Verificação obrigatória da senha atual
        if (updateDto.getCurrentPassword() == null || !passwordEncoder.matches(updateDto.getCurrentPassword(), est.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Senha atual incorreta."));
        }

        // Atualização parcial dos dados
        if (updateDto.getName() != null && !updateDto.getName().isBlank()) {
            est.setName(updateDto.getName());
        }

        if (updateDto.getUsername() != null && !updateDto.getUsername().isBlank() && !updateDto.getUsername().equals(est.getUsername())) {
            if (repository.existsByUsername(updateDto.getUsername())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Este nome de usuário já está em uso."));
            }
            est.setUsername(updateDto.getUsername());
        }

        if (updateDto.getEmail() != null && !updateDto.getEmail().isBlank() && !updateDto.getEmail().equals(est.getEmail())) {
            if (repository.existsByEmail(updateDto.getEmail())) {
                return ResponseEntity.badRequest().body(Map.of("message", "Este e-mail já está em uso."));
            }
            est.setEmail(updateDto.getEmail());
        }

        if (updateDto.getNewPassword() != null && !updateDto.getNewPassword().isBlank()) {
            est.setPassword(passwordEncoder.encode(updateDto.getNewPassword()));
        }

        repository.save(est);

        return ResponseEntity.ok(Map.of("message", "Perfil atualizado com sucesso!"));
    }
}
