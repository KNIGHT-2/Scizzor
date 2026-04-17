package com.knight.scizzor.controller;

import com.knight.scizzor.dto.ItemDto;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.entity.ProductItem;
import com.knight.scizzor.repository.EstablishmentRepository;
import com.knight.scizzor.repository.ProductItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@Transactional
public class ProductItemController {

    @Autowired
    private ProductItemRepository repository;

    @Autowired
    private EstablishmentRepository establishmentRepository;

    private Establishment getEstablishment(Authentication authentication) {
        String email = authentication.getName();
        return establishmentRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<ProductItem>> getAllProducts(Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        return ResponseEntity.ok(repository.findByEstablishment_Id(est.getId()));
    }

    @PostMapping
    public ResponseEntity<ProductItem> createProduct(@Valid @RequestBody ItemDto itemDto, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        ProductItem item = new ProductItem();
        item.setName(itemDto.getName());
        item.setPrice(itemDto.getPrice());
        item.setQuantity(itemDto.getQuantity() != null ? itemDto.getQuantity() : 0);
        item.setEstablishment(est);
        return ResponseEntity.ok(repository.save(item));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ItemDto itemDto, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        Optional<ProductItem> optionalItem = repository.findById(id);

        if (optionalItem.isPresent() && optionalItem.get().getEstablishment().getId().equals(est.getId())) {
            ProductItem item = optionalItem.get();
            item.setName(itemDto.getName());
            item.setPrice(itemDto.getPrice());
            if (itemDto.getQuantity() != null) {
                item.setQuantity(itemDto.getQuantity());
            }
            return ResponseEntity.ok(repository.save(item));
        }
        return ResponseEntity.status(403).body("Not authorized or not found.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        Optional<ProductItem> optionalItem = repository.findById(id);

        if (optionalItem.isPresent() && optionalItem.get().getEstablishment().getId().equals(est.getId())) {
            repository.delete(optionalItem.get());
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).body("Not authorized or not found.");
    }
}
