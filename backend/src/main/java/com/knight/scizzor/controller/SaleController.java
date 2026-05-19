package com.knight.scizzor.controller;

import com.knight.scizzor.dto.SaleDto;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.entity.ProductItem;
import com.knight.scizzor.entity.Sale;
import com.knight.scizzor.entity.ServiceItem;
import com.knight.scizzor.repository.EstablishmentRepository;
import com.knight.scizzor.repository.ProductItemRepository;
import com.knight.scizzor.repository.SaleRepository;
import com.knight.scizzor.repository.ServiceItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/sales")
@Transactional
public class SaleController {

    @Autowired
    private SaleRepository saleRepository;

    @Autowired
    private ProductItemRepository productRepository;

    @Autowired
    private ServiceItemRepository serviceRepository;

    @Autowired
    private EstablishmentRepository establishmentRepository;

    private Establishment getEstablishment(Authentication authentication) {
        String email = authentication.getName();
        return establishmentRepository.findByEmail(email).orElseThrow();
    }

    @GetMapping
    public ResponseEntity<List<Sale>> getSales(Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        return ResponseEntity.ok(saleRepository.findByEstablishmentIdOrderBySaleDateDesc(est.getId()));
    }

    @PostMapping
    public ResponseEntity<?> createSale(@Valid @RequestBody SaleDto saleDto, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        Sale sale = new Sale();
        sale.setEstablishment(est);
        sale.setItemId(saleDto.getItemId());
        sale.setItemType(saleDto.getItemType());
        sale.setQuantity(saleDto.getQuantity());
        sale.setSaleDate(LocalDateTime.now());

        if ("PRODUCT".equals(saleDto.getItemType())) {
            Optional<ProductItem> optProduct = productRepository.findById(saleDto.getItemId());
            if (optProduct.isEmpty() || !optProduct.get().getEstablishment().getId().equals(est.getId())) {
                return ResponseEntity.status(404).body("Produto não encontrado.");
            }
            ProductItem product = optProduct.get();
            sale.setItemName(product.getName());
            sale.setUnitPrice(product.getPrice());
            sale.setTotalPrice(product.getPrice() * sale.getQuantity());
            
            // Decrement stock
            int newQty = product.getQuantity() - sale.getQuantity();
            product.setQuantity(newQty); // allow negative or restrict to 0? let's allow negative or just set.
            productRepository.save(product);

        } else if ("SERVICE".equals(saleDto.getItemType())) {
            Optional<ServiceItem> optService = serviceRepository.findById(saleDto.getItemId());
            if (optService.isEmpty() || !optService.get().getEstablishment().getId().equals(est.getId())) {
                return ResponseEntity.status(404).body("Serviço não encontrado.");
            }
            ServiceItem service = optService.get();
            sale.setItemName(service.getName());
            sale.setUnitPrice(service.getPrice());
            sale.setTotalPrice(service.getPrice() * sale.getQuantity());
        } else {
            return ResponseEntity.badRequest().body("Tipo de item inválido.");
        }

        return ResponseEntity.ok(saleRepository.save(sale));
    }

    @DeleteMapping("/revert/{type}/{itemId}")
    public ResponseEntity<?> revertLastSale(@PathVariable String type, @PathVariable Long itemId, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        List<Sale> sales = saleRepository.findByEstablishmentIdOrderBySaleDateDesc(est.getId());
        
        Optional<Sale> latestSale = sales.stream()
            .filter(s -> s.getItemType().equals(type) && s.getItemId() != null && s.getItemId().equals(itemId))
            .findFirst();

        if (latestSale.isPresent()) {
            Sale sale = latestSale.get();
            
            // Restore product stock if applicable
            if ("PRODUCT".equals(sale.getItemType()) && sale.getItemId() != null) {
                Optional<ProductItem> optProduct = productRepository.findById(sale.getItemId());
                if (optProduct.isPresent() && optProduct.get().getEstablishment().getId().equals(est.getId())) {
                    ProductItem product = optProduct.get();
                    product.setQuantity(product.getQuantity() + sale.getQuantity());
                    productRepository.save(product);
                }
            }
            
            saleRepository.delete(sale);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(404).body("Nenhuma venda encontrada para remover.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSale(@PathVariable Long id, Authentication authentication) {
        Establishment est = getEstablishment(authentication);
        Optional<Sale> optSale = saleRepository.findById(id);

        if (optSale.isPresent() && optSale.get().getEstablishment().getId().equals(est.getId())) {
            Sale sale = optSale.get();
            
            // Restore product stock if applicable
            if ("PRODUCT".equals(sale.getItemType()) && sale.getItemId() != null) {
                Optional<ProductItem> optProduct = productRepository.findById(sale.getItemId());
                if (optProduct.isPresent() && optProduct.get().getEstablishment().getId().equals(est.getId())) {
                    ProductItem product = optProduct.get();
                    product.setQuantity(product.getQuantity() + sale.getQuantity());
                    productRepository.save(product);
                }
            }
            
            saleRepository.delete(sale);
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.status(403).body("Não autorizado ou não encontrado.");
    }
}
