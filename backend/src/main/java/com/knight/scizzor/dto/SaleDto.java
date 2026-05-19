package com.knight.scizzor.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

public class SaleDto {

    @NotNull
    private Long itemId;

    @NotNull
    private String itemType; // "PRODUCT" or "SERVICE"

    @NotNull
    @Min(1)
    private Integer quantity;

    public Long getItemId() { return itemId; }
    public void setItemId(Long itemId) { this.itemId = itemId; }

    public String getItemType() { return itemType; }
    public void setItemType(String itemType) { this.itemType = itemType; }

    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
}
