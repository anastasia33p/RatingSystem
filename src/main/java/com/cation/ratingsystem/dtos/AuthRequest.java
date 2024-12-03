package com.cation.ratingsystem.dtos;

public record AuthRequest(
        String username,
        String password
) {}
