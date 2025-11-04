package dev.chinhcd.backend.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;

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

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String name;

    private String email;

    @Column(name = "issue-category", columnDefinition = "NVARCHAR(MAX)")
    private String issueCategory;

    @Column(columnDefinition = "NVARCHAR(MAX)")
    private String detail;

    @Column(name = "date_created")
    private Date dateCreated;

    @Column(name = "support_answer", columnDefinition = "NVARCHAR(MAX)")
    private String supportAnswer;

    @Column(name = "status", columnDefinition = "NVARCHAR(MAX)")
    private String status;

}
