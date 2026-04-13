package com.knight.scizzor.repository;

import com.knight.scizzor.entity.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ServiceItemRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByEstablishmentId(Long establishmentId);
}
