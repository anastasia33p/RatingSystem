package com.cation.ratingsystem.models;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;


@Repository
public interface PlayerRepository extends JpaRepository<Player, Long> {
    @Query("SELECT p FROM Player p ORDER BY p.score DESC")
    Page<Player> findAllByOrderByScoreDesc(Pageable pageable);

    @Query("SELECT p FROM Player p ORDER BY p.level DESC")
    Page<Player> findAllByOrderByLevelDesc(Pageable pageable);

    Page<Player> findByNickNameContainingIgnoreCase(String nickName, Pageable pageable);
}
