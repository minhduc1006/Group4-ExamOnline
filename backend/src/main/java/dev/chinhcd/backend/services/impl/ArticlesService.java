package dev.chinhcd.backend.services.impl;

import dev.chinhcd.backend.dtos.request.longnt.AddArticleDTO;
import dev.chinhcd.backend.dtos.request.longnt.UpdateArticleRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;
import dev.chinhcd.backend.repository.IArticlesRepository;
import dev.chinhcd.backend.services.IArticlesService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;


import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArticlesService implements IArticlesService {

    private final IArticlesRepository articlesRepository;

    @Override
    public Optional<Articles> getArticlesById(long id) {
        return articlesRepository.findById(id);
    }

    @Override
    public PaginateArticlesResponse getPaginatedArticles(String type, int page, int pageSize) {
        ArticlesType articlesType;
        try {
            articlesType = ArticlesType.valueOf(type.toUpperCase()); // Chuyển String thành Enum
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid article type: " + type);
        }
        // Tạo đối tượng Pageable với pageNumber và pageSize
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        Page<Articles> articlesPage = articlesRepository.findAllArticlesByType(articlesType, pageable);

        // Trả về dữ liệu phân trang
        return new PaginateArticlesResponse(
                articlesPage.getContent(),  // Dữ liệu bài viết
                articlesPage.getTotalPages(),  // Tổng số trang
                articlesPage.getTotalElements(),  // Tổng số bài viết
                articlesPage.getNumber() + 1, // Trang hiện tại
                pageSize
        );
    }

    @Override
    public List<Articles> getSuggestedArticlesByType(ArticlesType type, int limit) {
        Pageable topN = PageRequest.of(0, limit);
        return articlesRepository.findTopSuggestedArticlesByType(type, topN);
    }

    @Override
    public List<Articles> getThreeNews() {
        return articlesRepository.findThreeNews();
    }

    @Override
    public List<Articles> getThreeTips() {
        return articlesRepository.findThreeTips();
    }

    @Override
    public PaginateArticlesResponse getArticlesByFilters(String type, Date startDate, Date endDate, int page, int pageSize) {
        Pageable pageable = PageRequest.of(page - 1, pageSize);

        ArticlesType articlesType = null;
        if (type != null && !type.equalsIgnoreCase("all")) {
            articlesType = ArticlesType.valueOf(type.toUpperCase());
        }

        Page<Articles> articlesPage = articlesRepository.findArticlesByFilters(articlesType, startDate, endDate, pageable);

        // Chuyển đổi định dạng ngày của các bài viết
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        articlesPage.getContent().forEach(article -> {
            if (article.getDate() != null) {
                String formattedDate = sdf.format(article.getDate());
                article.setDate(java.sql.Date.valueOf(formattedDate));
            }
        });

        return new PaginateArticlesResponse(articlesPage.getContent(), articlesPage.getTotalPages(), articlesPage.getTotalElements(), articlesPage.getNumber() + 1, pageSize);
    }

    @Override
    public Articles addArticle(AddArticleDTO articleDTO) {

        if (articleDTO.getTitle() == null || articleDTO.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title cannot be null or empty.");
        }

        if (articleDTO.getContent() == null || articleDTO.getContent().trim().isEmpty()) {
            throw new IllegalArgumentException("Content cannot be null or empty.");
        }

        // Lọc nội dung TinyMCE để tránh XSS (Chỉ giữ lại các thẻ an toàn)
        String safeContent = articleDTO.getContent().replaceAll("(?i)<script.*?>.*?</script>", "");

        // Tạo entity Articles từ DTO
        Articles article = new Articles();
        article.setTitle(articleDTO.getTitle());
        article.setContent(safeContent);
        article.setSummaryContent(articleDTO.getSummaryContent());
        article.setArticlesType(articleDTO.getArticlesType());
        article.setImageUrl(articleDTO.getImageUrl());

        // Thiết lập ngày hiện tại nếu không có ngày
        article.setDate(articleDTO.getDate() != null ? articleDTO.getDate() : new Date());

        return articlesRepository.save(article);
    }

    @Override
    public void deleteArticleById(Long id) {
        articlesRepository.deleteById(id);
    }

    @Override
    public Articles updateArticle(Long id, UpdateArticleRequest updateArticleRequest) {
        Articles existingArticle = articlesRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found"));

        // Cập nhật các trường hợp lệ
        if (updateArticleRequest.getTitle() != null) {
            existingArticle.setTitle(updateArticleRequest.getTitle());
        }
        if (updateArticleRequest.getContent() != null) {
            existingArticle.setContent(updateArticleRequest.getContent());
        }
        if (updateArticleRequest.getSummaryContent() != null) {
            existingArticle.setSummaryContent(updateArticleRequest.getSummaryContent());
        }
        if (updateArticleRequest.getImageUrl() != null) {
            existingArticle.setImageUrl(updateArticleRequest.getImageUrl());
        }
        if (updateArticleRequest.getArticlesType() != null) {
            existingArticle.setArticlesType(updateArticleRequest.getArticlesType());
        }

        return articlesRepository.save(existingArticle);
    }

}
