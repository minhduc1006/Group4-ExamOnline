package dev.chinhcd.backend.dtos.request;

import dev.chinhcd.backend.enums.AccountType;

public record PaymentRequest(
        Integer amount,
        AccountType accountType,
        Long id,
        String language
) {

}
