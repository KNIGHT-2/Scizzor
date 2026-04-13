package com.knight.scizzor.security;

import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.repository.EstablishmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EstablishmentRepository repository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        Establishment establishment = repository.findByEmail(emailOrUsername)
                .orElseGet(() -> repository.findByUsername(emailOrUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with string: " + emailOrUsername)));
        
        // We use email as the principal username in UserDetails
        return new User(establishment.getEmail(), establishment.getPassword(), new ArrayList<>());
    }
}
