package dev.chinhcd.backend.dtos.response.longnt;

import dev.chinhcd.backend.models.Articles;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;
@Data
@AllArgsConstructor
public class PaginateArticlesResponse {
    private List<Articles> articles;
    private int totalPages;
    private long totalItems;
    private int currentPage;
    private int pageSize;
}
