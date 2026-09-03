package com.knight.scizzor.controller;

import com.knight.scizzor.dto.ClientLoginDto;
import com.knight.scizzor.dto.ClientRegisterDto;
import com.knight.scizzor.dto.LoginDto;
import com.knight.scizzor.dto.RegisterDto;
import com.knight.scizzor.entity.Client;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.repository.ClientRepository;
import com.knight.scizzor.repository.EstablishmentRepository;
import com.knight.scizzor.security.JwtUtil;
import jakarta.validation.Valid;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EstablishmentRepository repository;

    @Autowired
    private ClientRepository clientRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsService userDetailsService;

    @PostMapping({"/register", "/salon/register"})
    public ResponseEntity<?> register(@RequestBody RegisterDto registerDto) {
        String username = registerDto.getUsername();
        
        if (username == null || username.isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "O nome de usuário é obrigatório."));
        }
        
        if (username.length() < 4 || username.length() > 35) {
            return ResponseEntity.badRequest().body(Map.of("message", "O nome de usuário deve ter entre 4 e 35 caracteres."));
        }
        
        if (username.startsWith("@")) {
            return ResponseEntity.badRequest().body(Map.of("message", "O nome de usuário não pode começar com '@'."));
        }

        if (repository.existsByUsername(username)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Este nome de usuário já está em uso."));
        }
    
        if (repository.existsByEmail(registerDto.getEmail()) || clientRepository.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Este e-mail já está em uso."));
        }

        Establishment establishment = new Establishment();
        establishment.setName(registerDto.getName());
        establishment.setUsername(username);
        establishment.setEmail(registerDto.getEmail());
        establishment.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        repository.save(establishment);

        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping({"/login", "/salon/login"})
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        Optional<Establishment> estOpt = repository.findByEmail(loginDto.getEmail());
        if (estOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("message", "Conta não encontrada como estabelecimento parceiro."));
        }

        Establishment est = estOpt.get();
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails, "ROLE_SALON", est.getId(), est.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", "ROLE_SALON");
        response.put("username", est.getUsername());
        response.put("name", est.getName());
        response.put("email", est.getEmail());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/client/register")
    public ResponseEntity<?> registerClient(@Valid @RequestBody ClientRegisterDto registerDto) {
        if (clientRepository.existsByEmail(registerDto.getEmail()) || repository.existsByEmail(registerDto.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Este e-mail já está em uso."));
        }

        Client client = new Client(
                registerDto.getName(),
                registerDto.getEmail(),
                registerDto.getPhone(),
                passwordEncoder.encode(registerDto.getPassword())
        );

        clientRepository.save(client);

        return ResponseEntity.ok(Map.of("message", "Cliente registrado com sucesso!"));
    }

    @PostMapping("/client/login")
    public ResponseEntity<?> loginClient(@Valid @RequestBody ClientLoginDto loginDto) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword()));

        Optional<Client> clientOpt = clientRepository.findByEmail(loginDto.getEmail());
        if (clientOpt.isEmpty()) {
            return ResponseEntity.status(403).body(Map.of("message", "Conta não encontrada como cliente final."));
        }

        Client client = clientOpt.get();
        final UserDetails userDetails = userDetailsService.loadUserByUsername(loginDto.getEmail());
        final String jwt = jwtUtil.generateToken(userDetails, "ROLE_CLIENT", client.getId(), client.getName());

        Map<String, Object> response = new HashMap<>();
        response.put("token", jwt);
        response.put("role", "ROLE_CLIENT");
        response.put("name", client.getName());
        response.put("email", client.getEmail());
        response.put("phone", client.getPhone());

        return ResponseEntity.ok(response);
    }
}
