package com.raos.fin.dto;

import java.math.BigDecimal;

public record AvailableAmountDTO(
    BigDecimal current,
    BigDecimal estimated) {

    public AvailableAmountDTO(BigDecimal current, BigDecimal estimated) {
        this.current = current != null ? current : BigDecimal.ZERO;
        this.estimated = estimated != null ? estimated : BigDecimal.ZERO;
    }

}