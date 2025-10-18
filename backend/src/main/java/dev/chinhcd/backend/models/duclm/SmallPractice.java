package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.Date;

@Entity
@Table(name = "small_practice")
@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class SmallPractice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int smallPracticeId;

    @Column(nullable = false)
    private String testName;

    @Column(nullable = false, columnDefinition = "Date")
    private Date testDate;

    @ManyToOne
    @JoinColumn(name = "practiceId")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Practice practice;

}
