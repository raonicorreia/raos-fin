package com.raos.invest.dto;

public record MonthlyImportRequest(
    Long userId,
    Integer month,
    Integer year
) {
    public MonthlyImportRequest(Long userId, Integer month, Integer year) {
        this.userId = userId;
        this.month = month;
        this.year = year;
    }
    
    public MonthlyImportRequest(Long userId, Integer month) {
        this(userId, month, java.time.Year.now().getValue());
    }
}
