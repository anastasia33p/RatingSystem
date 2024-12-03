package com.cation.ratingsystem.services;

import com.cation.ratingsystem.controllers.PlayerController;
import com.cation.ratingsystem.models.Player;
import com.cation.ratingsystem.models.PlayerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlayerService {
    private final PlayerRepository playerRepository;

    @Autowired
    public PlayerService(PlayerRepository playerRepository) {
        this.playerRepository = playerRepository;
    }

    public List<Player> getLeaderboard(PlayerController.TopParameter parameter, int pageNum, int pageSize) {
        Pageable pageable = PageRequest.of(pageNum, pageSize);

        if (parameter == PlayerController.TopParameter.LEVEL) {
            return playerRepository.findAllByOrderByLevelDesc(pageable).getContent();
        } else if (parameter == PlayerController.TopParameter.SCORE) {
            return playerRepository.findAllByOrderByScoreDesc(pageable).getContent();
        } else {
            return playerRepository.findAll(pageable).getContent();
        }
    }

    public Player applyPlayer(Player player) {
        return playerRepository.save(player);
    }

    public HttpStatus deletePlayer(Long id) {
        Player player = playerRepository.getReferenceById(id);
        playerRepository.delete(player);
        return HttpStatus.OK;
    }

    public List<Player> search(String name, int pageNum, int pageSize) {
        Pageable pageable = PageRequest.of(pageNum, pageSize);
        return playerRepository.findByNickNameContainingIgnoreCase(name, pageable).getContent();
    }
}