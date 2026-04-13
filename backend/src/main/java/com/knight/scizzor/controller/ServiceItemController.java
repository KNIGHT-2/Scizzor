package com.knight.scizzor.controller;

import com.knight.scizzor.dto.ItemDto;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.entity.ServiceItem;
import com.knight.scizzor.repository.EstablishmentRepository;
import com.knight.scizzor.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/services")
public class ServiceItemController {

    @Autowired
    private ServiceItemRepository repository;

    @Autowired
    private EstablishmentRepository establishmentRepository;

    private Establishment getEstablishment(Authentication authentication) {
        String email = authentication.getName();
        return establishmentRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<ServiceItem>> getAllServices(Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        return ResponseEntity.ok(repository.findByEstablishmentId(est.getId()));
    }

    @PostMapping
    public ResponseEntity<ServiceItem> createService(@Valid @RequestBody ItemDto itemDto, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        ServiceItem item = new ServiceItem();
        item.setName(itemDto.getName());
        item.setPrice(itemDto.getPrice());
        item.setEstablishment(est);
        return ResponseEntity.ok(repository.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @Valid @RequestBody ItemDto itemDto, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        Optional<ServiceItem> optionalItem = repository.findById(id);

        if (optionalItem.isPresent() && optionalItem.get().getEstablishment().getId().equals(est.getId())) {
            ServiceItem item = optionalItem.get();
            item.setName(itemDto.getName());
            item.setPrice(itemDto.getPrice());
            return ResponseEntity.ok(repository.save(item));
        }
        return ResponseEntity.status(403).body("Not authorized or not found.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        Optional<ServiceItem> optionalItem = repository.findById(id);

        if (optionalItem.isPresent() && optionalItem.get().getEstablishment().getId().equals(est.getId())) {
            repository.delete(optionalItem.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).body("Not authorized or not found.");
    }
}
