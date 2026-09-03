package com.knight.scizzor.security;

import com.knight.scizzor.entity.Client;
import com.knight.scizzor.entity.Establishment;
import com.knight.scizzor.repository.ClientRepository;
import com.knight.scizzor.repository.EstablishmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private EstablishmentRepository establishmentRepository;

    @Autowired
    private ClientRepository clientRepository;

    @Override
    public UserDetails loadUserByUsername(String emailOrUsername) throws UsernameNotFoundException {
        // Tenta encontrar em Establishment primeiro
        Optional<Establishment> establishment = establishmentRepository.findByEmail(emailOrUsername);
        if (establishment.isEmpty()) {
            establishment = establishmentRepository.findByUsername(emailOrUsername);
        }

        if (establishment.isPresent()) {
            return new User(
                    establishment.get().getEmail(),
                    establishment.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_SALON"))
            );
        }

        // Tenta encontrar em Client
        Optional<Client> client = clientRepository.findByEmail(emailOrUsername);
        if (client.isPresent()) {
            return new User(
                    client.get().getEmail(),
                    client.get().getPassword(),
                    List.of(new SimpleGrantedAuthority("ROLE_CLIENT"))
            );
        }

        throw new UsernameNotFoundException("User not found with string: " + emailOrUsername);
    }
}
