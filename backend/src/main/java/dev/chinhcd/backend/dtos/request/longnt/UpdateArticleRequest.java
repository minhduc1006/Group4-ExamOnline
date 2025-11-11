package dev.chinhcd.backend.dtos.request.longnt;

import dev.chinhcd.backend.enums.ArticlesType;
import org.springframework.web.multipart.MultipartFile;

public record UpdateArticleRequest(
        Long id,
        String title,
        String content,
        String summaryContent,
        String imageUrl,
        ArticlesType articlesType,
        MultipartFile imageFile
) {
}
