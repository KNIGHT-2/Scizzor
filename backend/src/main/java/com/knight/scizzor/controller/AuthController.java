package com.knight.scizzor.controller;

import com.knight.scizzor.dto.LoginDto;
import com.knight.scizzor.dto.RegisterDto;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.repository.EstablishmentRepository;
import com.knight.scizzor.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EstablishmentRepository repository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        if (repository.existsByUsername(registerDto.getUsername())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Username is already taken!"));
        }

        if (repository.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        Establishment establishment = new Establishment();
        establishment.setName(registerDto.getName());
        establishment.setUsername(registerDto.getUsername());
        establishment.setEmail(registerDto.getEmail());
        establishment.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        repository.save(establishment);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
        );

        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getEmail());
        
        Establishment est = repository.findByEmail(loginDto.getEmail()).orElseThrow();
        
        final String jwt = jwtUtil.generateToken(userDetails);

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("username", est.getUsername());
        response.put("name", est.getName());

        return ResponseEntity.ok(response);
    }
}
