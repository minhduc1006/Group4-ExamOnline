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
@Table(name = "test_results")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class TestResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int resultId;

    @Column(nullable = false)
    private int score;

    @Column(nullable = false)
    private Time timeSpent;

    @Column(nullable = false)
    private int attempts;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "small_practice_id")
    private SmallPractice smallPractice;
}
