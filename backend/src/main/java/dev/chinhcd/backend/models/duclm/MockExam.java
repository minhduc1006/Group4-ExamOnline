package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "mock_exam")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MockExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "mock_exam_id")
    private Long mockExamId;

    @Column(name = "exam_name", nullable = false, columnDefinition = "NVARCHAR(100)")
    private String examName;

    @Column(name = "exam_date", nullable = false)
    private Date examDate;

    @Column(name = "type", nullable = false)
    private String type;

    @Column(name = "grade")
    private String grade;
}

