package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "exam")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Exam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id")
    private Long examId;

    @Column(name = "exam_start", columnDefinition = "DATETIME2")
    private LocalDateTime examStart;

    @Column(name = "exam_end", columnDefinition = "DATETIME2")
    private LocalDateTime examEnd;

    @Column(name = "exam_name", columnDefinition = "NVARCHAR(50)")
    private String examName;

    @Column(name = "grade")
    private int grade;

    @Column(name = "status", columnDefinition = "NVARCHAR(50)")
    private String status;
}
