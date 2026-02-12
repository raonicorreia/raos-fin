package com.raos.fin.domain.projection;

import java.math.BigDecimal;

public interface AvailableAmountProjection {

    BigDecimal getCurrent();
    BigDecimal getEstimated();

}
