package com.cation.ratingsystem.controllers;

import com.cation.ratingsystem.models.Player;
import com.cation.ratingsystem.services.PlayerService;
import jakarta.annotation.Nullable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;


@RestController
@RequestMapping("/player")
public class PlayerController {
    private final PlayerService service;

    @Autowired
    public PlayerController(PlayerService service) {
        this.service = service;
    }


    @GetMapping("/top")
    public List<Player> getTop(
            @RequestParam @Nullable String by,
            @RequestParam @Nullable Integer page
    ) {
        if (page == null || page < 0) {
            page = 0;
        } else {
            page -= 1;
        }

        try {
            TopParameter parameter = null;
            if (by != null) {
                parameter = TopParameter.valueOf(by.toUpperCase());
            }
            List<Player> players = service.getLeaderboard(parameter, page, 10);
            return players;
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping("/search")
    public List<Player> search(
            @RequestParam String name,
            @RequestParam @Nullable Integer page
    ) {
        if (page == null || page < 0) {
            page = 0;
        } else {
            page -= 1;
        }

        try {
            return service.search(name, page, 10);
        } catch (Exception e) {
            return null;
        }
    }

    public enum TopParameter {
        SCORE,
        LEVEL,
        POSITION
    }
}

