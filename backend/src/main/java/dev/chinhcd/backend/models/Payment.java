package dev.chinhcd.backend.models;

import dev.chinhcd.backend.enums.AccountType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "payment")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne()
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    private AccountType accountType;

    @Column(name = "is-paid", nullable = false)
    private Boolean isPaid;

    @Column(name = "vnp_txn_ref", unique = true)
    private String vnp_TxnRef;

    @Column(name = "vnp_bank_tran_no")
    private String vnp_BankTranNo;

    @Column(name = "vnp_transaction_no")
    private String vnp_TransactionNo;

    @Column(name = "completed-at", columnDefinition = "DATETIME2(0)")
    private LocalDateTime completedAt;

    private Integer amount;
}
