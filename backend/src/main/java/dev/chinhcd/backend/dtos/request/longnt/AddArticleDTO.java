package dev.chinhcd.backend.dtos.request.longnt;

import dev.chinhcd.backend.enums.ArticlesType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AddArticleDTO {
    private String title;
    private Date date;
    private String content;
    private String summaryContent;
    private ArticlesType articlesType;
    private String imageUrl;
}