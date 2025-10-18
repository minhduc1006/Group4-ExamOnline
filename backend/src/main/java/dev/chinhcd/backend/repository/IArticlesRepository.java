package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface IArticlesRepository extends JpaRepository<Articles, Long> {

    // Tìm tất cả bài viết theo `ArticlesType`
    @Query("SELECT n FROM Articles n WHERE n.articlesType = :type ORDER BY n.date DESC")
    Page<Articles> findAllArticlesByType(@Param("type") ArticlesType type, Pageable pageable);

    Optional<Articles> findById(Long id);

    @Query("SELECT a FROM Articles a WHERE a.articlesType = :type ORDER BY a.date DESC")
    List<Articles> findTopSuggestedArticlesByType(@Param("type") ArticlesType type, Pageable pageable);

    @Query("SELECT n FROM Articles n where n.articlesType = 'NEWS' ORDER BY n.id DESC LIMIT 3")
    List<Articles> findThreeNews();

    @Query("SELECT n FROM Articles n where n.articlesType = 'TIPS' ORDER BY n.id DESC LIMIT 3")
    List<Articles> findThreeTips();

    @Query("SELECT a FROM Articles a WHERE (:type IS NULL OR a.articlesType = :type) AND (:startDate IS NULL OR a.date >= :startDate) AND (:endDate IS NULL OR a.date <= :endDate)")
    Page<Articles> findArticlesByFilters(
            @Param("type") ArticlesType type,
            @Param("startDate") Date startDate,
            @Param("endDate") Date endDate,
            Pageable pageable
    );

    @Query("SELECT a FROM Articles a ORDER BY a.date DESC")
    Page<Articles> findAllByOrderByDateDesc(Pageable pageable);

    void deleteById(Long id);

}
