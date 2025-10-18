package dev.chinhcd.backend.enums;

public enum AccountType {
    FREE_COURSE("free_course"),
    FULL_COURSE("full_course"),
    COMBO_COURSE("combo_course");

    private String accountType;

    AccountType(String accountType){
        this.accountType = accountType;
    }
}
