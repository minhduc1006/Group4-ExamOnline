package dev.chinhcd.backend.dtos.response;

import lombok.Builder;

import java.time.LocalDateTime;

@Builder
public record PurchaseHistoryResponse(
        String accountType,
        String vnp_TxnRef,
        String vnp_BankTranNo,
        String vnp_TransactionNo,
        LocalDateTime completedAt,
        Integer amount
) {}
