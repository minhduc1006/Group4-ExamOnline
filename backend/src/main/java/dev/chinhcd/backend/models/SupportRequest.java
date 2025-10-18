package dev.chinhcd.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.time.LocalDate;

@Builder
@Entity
@Table(name = "support-request")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class SupportRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    private String email;

    @Column(name = "issue-category")
    private String issueCategory;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String detail;

    @Column(name = "date_created")
    private Date dateCreated;

    @Column(name = "support_answer", columnDefinition = "NVARCHAR(MAX)")
    private String supportAnswer;

}
