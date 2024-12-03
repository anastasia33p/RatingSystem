package com.cation.ratingsystem.services;

import com.cation.ratingsystem.models.Admin;
import com.cation.ratingsystem.models.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final JwtService jwtService;
    private final AdminRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public AuthService(JwtService jwtService, AdminRepository repository, PasswordEncoder passwordEncoder) {
        this.jwtService = jwtService;
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    public String auth(String username, String password) {
        Admin admin = repository.findByUsername(username);
        if (admin != null && passwordEncoder.matches(password, admin.getPassword())) {
            return jwtService.generateToken(username);
        } else if (admin == null) {
            admin = new Admin(username, passwordEncoder.encode(password));
            repository.save(admin);
            return jwtService.generateToken(username);
        }
        return null;
    }

}
