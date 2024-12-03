package com.cation.ratingsystem.controllers;

import com.cation.ratingsystem.models.Player;
import com.cation.ratingsystem.services.PlayerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admin")
public class AdminController {
    private final PlayerService service;

    @Autowired
    public AdminController(PlayerService service) {
        this.service = service;
    }

    @PostMapping("/edit")
    public Player applyPlayer(
            @RequestBody Player player
    ) {
        try {
            return service.applyPlayer(player);
        } catch (Exception e) {
            return null;
        }
    }

    @DeleteMapping("/delete")
    public HttpStatus deletePlayer(
            @RequestParam Long id
    ) {
        try {
            return service.deletePlayer(id);
        } catch (Exception e) {
            return null;
        }
    }
}

