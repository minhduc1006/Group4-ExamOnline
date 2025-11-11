package dev.chinhcd.backend.models.longnt;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Entity
@Table(name = "schedule")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Schedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String roundName;

    @Column
    private Date examDate;
}
