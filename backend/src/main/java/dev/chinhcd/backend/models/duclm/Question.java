package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "questions")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int questionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String questionText;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String choice1;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String choice2;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String choice3;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String choice4;

}
