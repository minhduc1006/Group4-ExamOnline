package dev.chinhcd.backend.dtos.request;

import dev.chinhcd.backend.enums.AccountType;

public record ChangeAccountTypeRequest(
        Long id,
        AccountType accountType
) {

}
