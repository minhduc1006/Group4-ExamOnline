package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "Questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionId;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String questionText;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String choice1;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String choice2;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String choice3;

    @Column(nullable = false, columnDefinition = "NVARCHAR(MAX)")
    private String choice4;

    @Lob
    private byte[] audioFile;
}