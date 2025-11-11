package dev.chinhcd.backend.models.duclm;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

@Entity
@Table(name = "practice")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Practice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int practiceId;

    @Column
    private int practiceLevel;

    @Column
    private Date practiceDate;

    @Column
    private int grade;

    @Column
    private String status;

}
