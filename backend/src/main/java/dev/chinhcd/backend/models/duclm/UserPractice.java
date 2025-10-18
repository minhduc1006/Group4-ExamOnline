package dev.chinhcd.backend.models.duclm;

import dev.chinhcd.backend.models.User;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.sql.Time;

@Entity
@Table(name = "user_practice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserPractice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "practice_id")
    private Practice practice;

    @Column
    private int totalScore;

    @Column
    private Time totalTime;
}

