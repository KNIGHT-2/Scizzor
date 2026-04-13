package com.knight.scizzor.repository;

import com.knight.scizzor.entity.Establishment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface EstablishmentRepository extends JpaRepository<Establishment, Long> {
    Optional<Establishment> findByUsername(String username);
    Optional<Establishment> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
