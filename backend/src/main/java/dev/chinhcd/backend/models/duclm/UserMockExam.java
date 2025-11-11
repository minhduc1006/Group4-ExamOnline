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
@Table(name = "user_mock_exam")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserMockExam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_mock_exam_id")
    private Long userMockExamId;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "mock_exam_id")
    private MockExam mockExam;

    @Column(name = "score")
    private Double score;

    @Column(name = "total_time")
    private Time totalTime;

    @Column(name = "exam_name", columnDefinition = "NVARCHAR(100)")
    private String examName;
}

