package dev.chinhcd.backend.models.duclm;

import dev.chinhcd.backend.models.User;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Time;

@Entity
@Table(name = "user_exam")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserExam {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_exam_id")
    private Long userExamId;

    @Column(name = "exam_name", columnDefinition = "NVARCHAR(50)")
    private String examName;

    @Column(name = "score")
    private Double score;

    @Column(name = "total_time")
    private Time totalTime;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}

