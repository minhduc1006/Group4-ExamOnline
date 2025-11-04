package dev.chinhcd.backend.repository;

import dev.chinhcd.backend.models.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IPaymentRepository extends JpaRepository<Payment, Long> {

    @Modifying
    @Query("delete from Payment p where p.user.id=:userId and p.isPaid=:isPaid")
    void deleteByUserIdAndIsPaid(long userId, boolean isPaid);

    @Query("select p from Payment p where p.vnp_TxnRef=:txn")
    List<Payment> getPaymentByVnp_txn_ref(String txn);

    @Query("select p from Payment p where p.user.id=:userId and p.isPaid=true order by p.completedAt desc ")
    List<Payment> getByUserId(Long userId);
}
