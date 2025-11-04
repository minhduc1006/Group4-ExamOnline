package dev.chinhcd.backend.services;

import dev.chinhcd.backend.dtos.request.longnt.AddArticleDTO;
import dev.chinhcd.backend.dtos.request.longnt.UpdateArticleRequest;
import dev.chinhcd.backend.dtos.response.longnt.PaginateArticlesResponse;
import dev.chinhcd.backend.enums.ArticlesType;
import dev.chinhcd.backend.models.Articles;

import java.util.Date;
import java.util.List;
import java.util.Optional;

public interface IArticlesService {

    Optional<Articles> getArticlesById(long id);

    PaginateArticlesResponse getPaginatedArticles(String type, int page, int pageSize);

    List<Articles> getSuggestedArticlesByType(ArticlesType type, int limit);

    List<Articles> getThreeNews();

    List<Articles> getThreeTips();

    PaginateArticlesResponse getArticlesByFilters(String type, Date startDate, Date endDate, int page, int pageSize);

    Articles addArticle(AddArticleDTO addArticleDTO);

    void deleteArticleById(Long id);

    Articles updateArticle(UpdateArticleRequest updateArticleRequest);
}
