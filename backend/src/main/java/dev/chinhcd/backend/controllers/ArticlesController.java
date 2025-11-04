package dev.chinhcd.backend.controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.chinhcd.backend.dtos.request.longnt.AddArticleDTO;
import dev.chinhcd.backend.dtos.request.longnt.UpdateArticleRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;
import dev.chinhcd.backend.services.IArticlesService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Articles> addArticle(
            @RequestParam("article") String articleJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {

        ObjectMapper objectMapper = new ObjectMapper();
        AddArticleDTO articleDTO;
        try {
            articleDTO = objectMapper.readValue(articleJson, AddArticleDTO.class);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

        articleDTO.setImageFile(imageFile);

        Articles savedArticle = articlesService.addArticle(articleDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedArticle);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Articles> updateArticle(
            @PathVariable Long id,
            @RequestParam("article") String articleJson,
            @RequestPart(value = "imageFile", required = false) MultipartFile imageFile) {
        ObjectMapper objectMapper = new ObjectMapper();
        UpdateArticleRequest updateArticleRequest;
        try {
            UpdateArticleRequest tempRequest = objectMapper.readValue(articleJson, UpdateArticleRequest.class);
            updateArticleRequest = new UpdateArticleRequest(
                    id,
                    tempRequest.title(),
                    tempRequest.content(),
                    tempRequest.summaryContent(),
                    tempRequest.imageUrl(),
                    tempRequest.articlesType(),
                    imageFile
            );
            Articles updatedArticle = articlesService.updateArticle(updateArticleRequest);
            return ResponseEntity.ok(updatedArticle);
        } catch (JsonProcessingException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }
}
