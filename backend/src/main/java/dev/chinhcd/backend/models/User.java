package dev.chinhcd.backend.models;

import dev.chinhcd.backend.enums.AccountType;
import dev.chinhcd.backend.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.sql.Date;
import java.util.List;

@Builder
@Entity
@Table(name = "users")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, columnDefinition = "NVARCHAR(100)")
    private String username;

    @Column(nullable = true, columnDefinition = "NVARCHAR(100)")
    private String name;

    @Column(nullable = true, name = "gender", columnDefinition = "NVARCHAR(10)")
    private String gender;

    @Column(nullable = true, name = "birth_date", columnDefinition = "DATE")
    private Date birthDate;

    @Column(nullable = true, unique = true, columnDefinition = "NVARCHAR(100)")
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(nullable = true, columnDefinition = "NVARCHAR(100)")
    private String province;

    @Column(nullable = true, columnDefinition = "NVARCHAR(100)")
    private String district;

    @Column(nullable = true, columnDefinition = "NVARCHAR(100)")
    private String ward;

    @Column(nullable = true)
    private Integer grade;

    @Column(nullable = true, columnDefinition = "NVARCHAR(100)", name = "education_level")
    private String educationLevel;

    @OneToMany(mappedBy = "user")
    private List<RefreshToken> refreshToken;

    @Column(columnDefinition = "BIT DEFAULT 0", nullable = false, name = "is_doing_exam")
    private Boolean isDoingExam;

    @Column(nullable = true, name = "expired_date_package", columnDefinition = "DATE")
    private Date expiredDatePackage;

    @Column(nullable = false, name = "is_locked", columnDefinition = "BIT DEFAULT 0")
    private Boolean isLocked;
}
