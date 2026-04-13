package com.knight.scizzor.repository;

import com.knight.scizzor.entity.ProductItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ProductItemRepository extends JpaRepository<ProductItem, Long> {
    List<ProductItem> findByEstablishmentId(Long establishmentId);
}
