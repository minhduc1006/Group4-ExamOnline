package dev.chinhcd.backend.dtos.request;

import java.time.LocalDateTime;

public record PaymentSuccessRequest(
        LocalDateTime completedAt,
        String vnp_TxnRef,
        String vnp_BankTranNo,
        String vnp_TransactionNo
) {
}
