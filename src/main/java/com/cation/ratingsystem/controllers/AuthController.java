package com.cation.ratingsystem.controllers;

import com.cation.ratingsystem.dtos.AuthRequest;
import com.cation.ratingsystem.dtos.AuthResponse;
import com.cation.ratingsystem.services.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    private final AuthService service;

    @Autowired
    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/auth")
    public Object register(
            @RequestBody AuthRequest request
    ) {
        Object response = ResponseEntity.ok("Wrong username or password");
        String ans = service.auth(request.username(), request.password());
        if (ans != null) {
            response = new AuthResponse(ans);
        }
        return response;
    }

}
