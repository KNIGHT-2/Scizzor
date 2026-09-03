package com.knight.scizzor.controller;

import com.knight.scizzor.entity.Client;
import com.knight.scizzor.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/client")
public class ClientController {

    @Autowired
    private ClientRepository clientRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(Authentication authentication) {
        String email = authentication.getName();
        Optional<Client> clientOpt = clientRepository.findByEmail(email);
        if (clientOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Client client = clientOpt.get();
        return ResponseEntity.ok(Map.of(
                "id", client.getId(),
                "name", client.getName(),
                "email", client.getEmail(),
                "phone", client.getPhone(),
                "stripeCustomerId", client.getStripeCustomerId() != null ? client.getStripeCustomerId() : ""
        ));
    }
}
