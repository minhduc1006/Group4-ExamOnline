package dev.chinhcd.backend.dtos.request.longnt;

import dev.chinhcd.backend.enums.ArticlesType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UpdateArticleRequest {
    private String title;
    private String content;
    private String summaryContent;
    private String imageUrl;
    private ArticlesType articlesType;
}
