package dev.chinhcd.backend.models;

import dev.chinhcd.backend.enums.ArticlesType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "articles")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Articles {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Date date;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String title;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String content;

    @Column(columnDefinition = "NVARCHAR(MAX)", name = "summary_content")
    private String summaryContent;

    @Column(columnDefinition = "NVARCHAR(MAX)", name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ArticlesType articlesType;
}
