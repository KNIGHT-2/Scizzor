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
        return ResponseEntity.ok(new ProfileResponseDto(
                est.getName(),
                est.getUsername(),
                est.getEmail(),
                est.getLogoUrl(),
                est.getBio(),
                est.getPhone(),
                est.getAddress()
        ));
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

        if (updateDto.getLogoUrl() != null) {
            est.setLogoUrl(updateDto.getLogoUrl());
        }

        if (updateDto.getBio() != null) {
            est.setBio(updateDto.getBio());
        }

        if (updateDto.getPhone() != null) {
            est.setPhone(updateDto.getPhone());
        }

        if (updateDto.getAddress() != null) {
            est.setAddress(updateDto.getAddress());
        }

        if (updateDto.getUsername() != null && !updateDto.getUsername().isBlank()) {
            String newUsername = updateDto.getUsername();
            
            if (newUsername.length() < 4 || newUsername.length() > 35) {
                return ResponseEntity.badRequest().body(Map.of("message", "O nome de usuário deve ter entre 4 e 35 caracteres."));
            }
            
            if (newUsername.startsWith("@")) {
                return ResponseEntity.badRequest().body(Map.of("message", "O nome de usuário não pode começar com '@'."));
            }
            
            if (!newUsername.equals(est.getUsername())) {
                if (repository.existsByUsername(newUsername)) {
                    return ResponseEntity.badRequest().body(Map.of("message", "Este nome de usuário já está em uso."));
                }
                est.setUsername(newUsername);
            }
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
