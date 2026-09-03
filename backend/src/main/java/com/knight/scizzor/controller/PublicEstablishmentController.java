package com.knight.scizzor.controller;

import com.knight.scizzor.dto.PublicProductDto;
import com.knight.scizzor.dto.PublicSalonDto;
import com.knight.scizzor.dto.PublicServiceDto;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.repository.EstablishmentRepository;
import com.knight.scizzor.repository.ProductItemRepository;
import com.knight.scizzor.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
public class PublicEstablishmentController {

    @Autowired
    private EstablishmentRepository establishmentRepository;

    @Autowired
    private ServiceItemRepository serviceItemRepository;

    @Autowired
    private ProductItemRepository productItemRepository;

    @GetMapping({
            "/api/public/salons/{username}",
            "/api/public/salons/@{username}",
            "/api/salons/@{username}",
            "/api/salons/{username}",
            "/@{username}"
    })
    public ResponseEntity<?> getPublicSalonProfile(@PathVariable String username) {
        String cleanUsername = username.startsWith("@") ? username.substring(1) : username;

        Optional<Establishment> estOpt = establishmentRepository.findByUsername(cleanUsername);
        if (estOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Establishment est = estOpt.get();

        List<PublicServiceDto> services = serviceItemRepository.findByEstablishmentId(est.getId())
                .stream()
                .map(s -> new PublicServiceDto(s.getId(), s.getName(), s.getPrice(), s.getDurationMinutes()))
                .collect(Collectors.toList());

        List<PublicProductDto> products = productItemRepository.findByEstablishmentId(est.getId())
                .stream()
                .map(p -> new PublicProductDto(p.getId(), p.getName(), p.getPrice(), p.getQuantity()))
                .collect(Collectors.toList());

        PublicSalonDto publicDto = new PublicSalonDto(
                est.getName(),
                est.getUsername(),
                est.getLogoUrl(),
                est.getBio(),
                est.getPhone(),
                est.getAddress(),
                services,
                products
        );

        return ResponseEntity.ok(publicDto);
    }
}
