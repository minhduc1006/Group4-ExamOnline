package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.enums.AccountType;
import dev.chinhcd.backend.enums.Role;
import dev.chinhcd.backend.models.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface IUserRepository extends JpaRepository<User, Long> {

    boolean existsByUsername(String username);

    Optional<User> findByUsername(String username);

    Optional<User> findByEmail(String email);

    List<User> getUsersByRole(Role role);

    @Query("SELECT u FROM User u WHERE u.role = :role " +
            "AND (:username IS NULL OR u.username LIKE %:username%) " +
            "AND (:email IS NULL OR u.email LIKE %:email%)" +
            "AND (:accountType IS NULL OR u.accountType = :accountType)")
    Page<User> getUsersByRole(Role role, Pageable pageable, String username, String email, AccountType accountType);

    Long countByRole(Role role);

}
