package dev.chinhcd.backend.controllers;

import dev.chinhcd.backend.dtos.request.longnt.AddArticleDTO;
import dev.chinhcd.backend.dtos.request.longnt.UpdateArticleRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;
import dev.chinhcd.backend.services.IArticlesService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@RequestMapping("/articles")
@RequiredArgsConstructor
public class ArticlesController {

    private final IArticlesService articlesService;

    @GetMapping("/{id}")
    public ResponseEntity<Articles> getArticleById(@PathVariable Long id) {
        return ResponseEntity.ok(articlesService.getArticlesById(id).orElse(null));
    }

    @GetMapping
    public ResponseEntity<PaginateArticlesResponse> getPaginatedArticles(
            @RequestParam(name = "type", defaultValue = "news") String type,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "pageSize", defaultValue = "6") int pageSize) {
        return ResponseEntity.ok(articlesService.getPaginatedArticles(type, page, pageSize));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<Articles>> getSuggestedArticles(@RequestParam("type") ArticlesType type) {
        List<Articles> articles = articlesService.getSuggestedArticlesByType(type, 3);
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/news/latest")
    public ResponseEntity<List<Articles>> getLatestNews() {
        return ResponseEntity.ok(articlesService.getThreeNews());
    }

    @GetMapping("/tips/latest")
    public ResponseEntity<List<Articles>> getLatestTips() {
        return ResponseEntity.ok(articlesService.getThreeTips());
    }

    @GetMapping("/filtered")
    public ResponseEntity<PaginateArticlesResponse> getFilteredArticles(
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date startDate,
            @RequestParam(name = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) Date endDate,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "pageSize", defaultValue = "7") int pageSize
    ) {
        PaginateArticlesResponse response = articlesService.getArticlesByFilters(type, startDate, endDate, page, pageSize);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articlesService.deleteArticleById(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<Articles> addArticle(@RequestBody AddArticleDTO addArticleDTO) {
        Articles savedArticle = articlesService.addArticle(addArticleDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Articles> updateArticle(@PathVariable Long id, @RequestBody UpdateArticleRequest request) {
        Articles updatedArticle = articlesService.updateArticle(id, request);
        return ResponseEntity.ok(updatedArticle);
    }
}
